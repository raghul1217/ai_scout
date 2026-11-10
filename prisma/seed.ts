import { PrismaClient } from "@prisma/client";
import { BEST_OF_AI_TOOLS } from "../lib/tools/bestofai";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Savzen database...");

  // 1. Categories
  const categoriesData = [
    { slug: "productivity", name: "Productivity", color: "#3B82F6", description: "AI tools and workflows to boost daily productivity." },
    { slug: "study-learning", name: "Study & Learning", color: "#10B981", description: "Learn AI concepts, models, and math." },
    { slug: "design-video", name: "Design & Video", color: "#EC4899", description: "Generative visual, video, and audio synthesis tools." },
    { slug: "coding-dev", name: "Coding & Dev", color: "#8B5CF6", description: "Developer tools, code copilots, and debuggers." },
    { slug: "enterprise-agents", name: "Enterprise & Agents", color: "#F59E0B", description: "Multi-agent systems, MCP, and autonomous bots." },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories.push(record);
  }
  console.log(`✓ Seeded ${categories.length} categories`);

  // 2. Plans (Free Community & ₹499 Pro)
  const plansData = [
    {
      name: "Free Community",
      slug: "free",
      description: "Essential AI tool directory and weekly curated updates.",
      price: 0,
      currency: "INR",
      billingType: "ONE_TIME" as const,
      durationDays: null,
      isActive: true,
      features: [
        "Curated directory of 150+ verified AI tools",
        "Weekly AI newsletter & curated headlines",
        "Public community access on WhatsApp",
        "Basic search and filtering",
      ],
      sortOrder: 1,
    },
    {
      name: "Savzen Pro",
      slug: "pro",
      description: "Full lifetime access to premium blueprints, advanced prompt packs, and member lounge.",
      price: 49900, // ₹499.00
      currency: "INR",
      billingType: "LIFETIME" as const,
      durationDays: null,
      isActive: true,
      features: [
        "Everything in Free Community",
        "Access to all Premium Blueprints & Guides",
        "Production-tested agent prompt libraries",
        "Monthly commercial AI benchmark reports",
        "Priority VIP community lounge",
        "Lifetime access to all future blueprints",
      ],
      sortOrder: 2,
    },
  ];

  for (const plan of plansData) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }
  console.log("✓ Seeded subscription plans");

  // 3. AI Tools (from Best of AI Directory)
  const categoryMap = new Map<string, string>();
  for (const c of categories) {
    categoryMap.set(c.slug, c.id);
  }

  for (const tool of BEST_OF_AI_TOOLS) {
    const categoryId = categoryMap.get(tool.categorySlug) ?? null;
    await prisma.aITool.upsert({
      where: { slug: tool.slug },
      update: {
        name: tool.name,
        tagline: tool.tagline,
        description: tool.description,
        websiteUrl: tool.websiteUrl,
        logoUrl: tool.logoUrl,
        pricingType: tool.pricingType,
        priceStart: tool.priceStart,
        rating: tool.rating,
        reviewCount: tool.reviewCount,
        isFeatured: tool.isFeatured,
        isVerified: tool.isVerified,
        ...(categoryId ? { categoryId } : {}),
      },
      create: {
        slug: tool.slug,
        name: tool.name,
        tagline: tool.tagline,
        description: tool.description,
        websiteUrl: tool.websiteUrl,
        logoUrl: tool.logoUrl,
        pricingType: tool.pricingType,
        priceStart: tool.priceStart,
        rating: tool.rating,
        reviewCount: tool.reviewCount,
        isFeatured: tool.isFeatured,
        isVerified: tool.isVerified,
        categoryId,
      },
    });
  }
  console.log(`✓ Seeded ${BEST_OF_AI_TOOLS.length} AI tools from Best of AI catalog`);

  // 4. Articles
  const devCat = categories.find((c) => c.slug === "coding-dev");
  const articlesData = [
    {
      slug: "anthropic-claude-3-7-hybrid-reasoning",
      title: "Inside Claude 3.7 Sonnet: Why Hybrid Reasoning Changes Dev Workflows",
      summary: "Anthropic's latest model lets engineers dynamically switch between immediate generation and extended thinking steps, fundamentally altering coding benchmarks.",
      content: `### The Next Leap in Practical Reasoning\n\nTraditional reasoning models enforce latency penalties even on simple tasks. Claude 3.7 introduces a hybrid architecture where the model dynamically determines how much thinking budget to allocate, or allows the developer to explicitly set standard versus extended thinking parameters.\n\n#### Key Benchmark Shifts\n\n1. **SWE-bench Verified**: Over 70% zero-shot resolution.\n2. **Front-end Generation**: Dramatic reduction in hallucinated CSS classes and invalid state updates.\n3. **Refactoring Large Codebases**: Superior understanding of dependency graphs across thousands of lines of context.`,
      categoryId: devCat?.id,
      status: "PUBLISHED" as const,
      accessLevel: "FREE" as const,
      readTimeMinutes: 4,
      publishedAt: new Date(),
    },
    {
      slug: "architecting-multi-agent-production-mcp",
      title: "Architecting Multi-Agent Production Systems with Model Context Protocol (MCP)",
      summary: "A practical guide to connecting autonomous coding agents to local developer tools, databases, and continuous integration pipelines securely.",
      content: `### Why MCP Is Becoming the Standard\n\nThe Model Context Protocol (MCP) provides an open standard for securely connecting LLM agents to data sources and tools. Rather than writing custom plugin integrations for every platform, MCP enables a unified interface.\n\n#### Core Architectural Pillars\n\n- **Client-Host-Server Topology**: Clear boundary isolation between what the model sees and what tools can execute.\n- **Stdio and SSE Transports**: Low-latency local command execution alongside secure remote streaming.\n- **Deterministic Tool Schemas**: JSON-Schema validated inputs preventing unexpected agent tool hallucinations.`,
      categoryId: devCat?.id,
      status: "PUBLISHED" as const,
      accessLevel: "PREMIUM" as const,
      readTimeMinutes: 8,
      publishedAt: new Date(),
    },
  ];

  for (const article of articlesData) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }
  console.log("✓ Seeded news articles");

  // 5. Learning Resources
  const resourcesData = [
    {
      slug: "build-autonomous-research-agent",
      title: "Build an Autonomous Research Agent with Next.js 15 & Tools",
      description: "Step-by-step hands-on tutorial guiding you through building a web-scraping, fact-checking AI research assistant.",
      content: "Complete guide on orchestrating multi-step research tasks with streaming UI and citation persistence.",
      categoryId: devCat?.id,
      difficulty: "Intermediate",
      format: "Tutorial",
      estimatedHours: 2.5,
      accessLevel: "FREE" as const,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      slug: "enterprise-production-rag-hybrid-search",
      title: "Enterprise Production RAG Blueprint: Hybrid Dense & Sparse Retrieval",
      description: "Architectural blueprint detailing reciprocal rank fusion, metadata filtering, and re-ranking for million-token corporate knowledge bases.",
      content: "Deep technical guide covering chunking strategies, pgvector optimization, and Cohere re-ranking models.",
      categoryId: devCat?.id,
      difficulty: "Advanced",
      format: "Blueprint",
      estimatedHours: 4.0,
      accessLevel: "PREMIUM" as const,
      isFeatured: true,
      publishedAt: new Date(),
    },
  ];

  for (const res of resourcesData) {
    await prisma.learningResource.upsert({
      where: { slug: res.slug },
      update: res,
      create: res,
    });
  }
  console.log("✓ Seeded learning resources");

  console.log("Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
