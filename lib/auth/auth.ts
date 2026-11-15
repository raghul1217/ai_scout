import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db/prisma";

const rawOrigins = [
  "https://savzyen.si",
  "https://www.savzyen.si",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.APP_URL,
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined,
];

const trustedOrigins = Array.from(
  new Set(rawOrigins.filter((u): u is string => Boolean(u && typeof u === "string")))
);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://savzyen.si",
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        input: false,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  secret: process.env.BETTER_AUTH_SECRET || "development_secret_32_characters_minimum_len_key_ai_scout_2026",
});
