import { google } from "googleapis";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils";

// Schema for row validation
const articleRowSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  summary: z.string().min(5),
  content: z.string().min(10),
  category: z.string().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  accessLevel: z.enum(["FREE", "PREMIUM"]).default("FREE"),
  author: z.string().default("AI Scout Team"),
  readTime: z.number().int().min(1).default(3),
});

export interface SyncResult {
  runId: string;
  status: "SUCCESS" | "FAILED" | "PARTIAL";
  totalRows: number;
  successRows: number;
  errorRows: number;
  errorMessage?: string;
}

export async function runGoogleSheetsSync(): Promise<SyncResult> {
  // Initialize sync log in DB
  const syncRun = await prisma.contentSyncRun.create({
    data: {
      source: "GOOGLE_SHEETS",
      status: "RUNNING",
    },
  });

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    const errorMsg = "Google Sheets credentials not configured (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, or GOOGLE_SHEET_ID missing).";
    await prisma.contentSyncRun.update({
      where: { id: syncRun.id },
      data: {
        status: "FAILED",
        errorMessage: errorMsg,
        completedAt: new Date(),
      },
    });
    return {
      runId: syncRun.id,
      status: "FAILED",
      totalRows: 0,
      successRows: 0,
      errorRows: 0,
      errorMessage: errorMsg,
    };
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Fetch Articles sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Articles!A2:H100", // Header is row 1
    });

    const rows = response.data.values || [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2;

      try {
        const [title, summary, content, categorySlug, statusRaw, accessLevelRaw, author, readTimeRaw] = row;
        if (!title) continue;

        const parsed = articleRowSchema.parse({
          title,
          summary: summary || title,
          content: content || summary || title,
          category: categorySlug,
          status: statusRaw ? statusRaw.toUpperCase() : "DRAFT",
          accessLevel: accessLevelRaw ? accessLevelRaw.toUpperCase() : "FREE",
          author: author || "AI Scout Team",
          readTime: readTimeRaw ? parseInt(readTimeRaw, 10) : 3,
        });

        const articleSlug = slugify(parsed.slug || parsed.title);

        // Find or associate category
        let categoryId = null;
        if (parsed.category) {
          const category = await prisma.category.findUnique({
            where: { slug: parsed.category.toLowerCase().trim() },
          });
          if (category) categoryId = category.id;
        }

        // Idempotent upsert
        await prisma.article.upsert({
          where: { slug: articleSlug },
          update: {
            title: parsed.title,
            summary: parsed.summary,
            content: parsed.content,
            categoryId,
            status: parsed.status as any,
            accessLevel: parsed.accessLevel as any,
            authorName: parsed.author,
            readTimeMinutes: parsed.readTime,
            publishedAt: parsed.status === "PUBLISHED" ? new Date() : undefined,
          },
          create: {
            slug: articleSlug,
            title: parsed.title,
            summary: parsed.summary,
            content: parsed.content,
            categoryId,
            status: parsed.status as any,
            accessLevel: parsed.accessLevel as any,
            authorName: parsed.author,
            readTimeMinutes: parsed.readTime,
            publishedAt: parsed.status === "PUBLISHED" ? new Date() : null,
          },
        });

        await prisma.syncRowLog.create({
          data: {
            syncRunId: syncRun.id,
            sheetRowNumber: rowNum,
            contentType: "article",
            slug: articleSlug,
            status: "SUCCESS",
          },
        });

        successCount++;
      } catch (rowErr: any) {
        errorCount++;
        await prisma.syncRowLog.create({
          data: {
            syncRunId: syncRun.id,
            sheetRowNumber: rowNum,
            contentType: "article",
            status: "ERROR",
            errorMessage: rowErr?.message || "Validation failed",
          },
        });
      }
    }

    const finalStatus = errorCount === 0 ? "SUCCESS" : successCount > 0 ? "PARTIAL" : "FAILED";

    await prisma.contentSyncRun.update({
      where: { id: syncRun.id },
      data: {
        status: finalStatus,
        totalRows: rows.length,
        successRows: successCount,
        errorRows: errorCount,
        completedAt: new Date(),
      },
    });

    return {
      runId: syncRun.id,
      status: finalStatus,
      totalRows: rows.length,
      successRows: successCount,
      errorRows: errorCount,
    };
  } catch (error: any) {
    const errorMsg = error?.message || "Failed to execute Google Sheets sync";
    await prisma.contentSyncRun.update({
      where: { id: syncRun.id },
      data: {
        status: "FAILED",
        errorMessage: errorMsg,
        completedAt: new Date(),
      },
    });

    return {
      runId: syncRun.id,
      status: "FAILED",
      totalRows: 0,
      successRows: 0,
      errorRows: 0,
      errorMessage: errorMsg,
    };
  }
}
