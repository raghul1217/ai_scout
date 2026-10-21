import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding AI Scout database...");

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

  // 2. Plans
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
      name: "AI Scout Pro (Monthly)",
      slug: "pro-monthly",
      description: "Full access to premium blueprints, advanced prompt packs, and member lounge.",
      price: 99900, // ₹999.00
      currency: "INR",
      billingType: "MONTHLY" as const,
      durationDays: 30,
      isActive: true,
      features: [
        "Everything in Free Community",
        "Access to all Premium Blueprints & Guides",
        "Production-tested agent prompt libraries",
        "Monthly commercial AI benchmark reports",
        "Priority VIP community lounge",
      ],
      sortOrder: 2,
    },
    {
      name: "Founder Lifetime Access",
      slug: "pro-lifetime",
      description: "One-time investment for permanent access to all current and future intelligence.",
      price: 499900, // ₹4,999.00
      currency: "INR",
      billingType: "LIFETIME" as const,
      durationDays: null,
      isActive: true,
      features: [
        "Permanent lifetime access to all vaults",
        "All future courses, workshops & blueprints",
        "Private WhatsApp & Discord Founders channel",
        "Commercial rights to all provided prompt kits",
        "Direct architectural Q&A with AI Scout authors",
      ],
      sortOrder: 3,
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

  // 3. AI Tools
  const prodCat = categories.find((c) => c.slug === "productivity");
  const devCat = categories.find((c) => c.slug === "coding-dev");
  const designCat = categories.find((c) => c.slug === "design-video");

  const toolsData = [
    {
      slug: "claude-3-7-sonnet",
      name: "Claude 3.7 Sonnet",
      tagline: "Hybrid reasoning LLM with toggleable deep-thinking mode",
      description: "Anthropic's flagship model combining ultra-fast response generation with extended step-by-step thinking for deep coding and complex logic.",
      categoryId: devCat?.id,
      websiteUrl: "https://anthropic.com/claude",
      pricingType: "FREEMIUM" as const,
      priceStart: "Free / $20/mo",
      rating: 4.9,
      reviewCount: 420,
      isFeatured: true,
      isVerified: true,
    },
    {
      slug: "cursor-ai",
      name: "Cursor",
      tagline: "The AI-first code editor designed for pair programming velocity",
      description: "A VS Code fork engineered for AI code generation, whole-repo semantic indexing, multi-file edits, and automated terminal debugging.",
      categoryId: devCat?.id,
      websiteUrl: "https://cursor.com",
      pricingType: "FREEMIUM" as const,
      priceStart: "Free / $20/mo",
      rating: 4.8,
      reviewCount: 890,
      isFeatured: true,
      isVerified: true,
    },
    {
      slug: "v0-by-vercel",
      name: "v0 by Vercel",
      tagline: "Generative UI system producing production-ready React components",
      description: "Prompt-driven component generator outputting modern Tailwind CSS, shadcn/ui, and React code that drop right into Next.js applications.",
      categoryId: devCat?.id,
      websiteUrl: "https://v0.dev",
      pricingType: "FREEMIUM" as const,
      priceStart: "Free / $20/mo",
      rating: 4.7,
      reviewCount: 310,
      isFeatured: true,
      isVerified: true,
    },
    {
      slug: "perplexity-ai",
      name: "Perplexity AI",
      tagline: "Conversational answer engine with live web sources & citations",
      description: "Combines real-time web search with multi-model synthesis to deliver synthesized, cited answers instead of standard search link pages.",
      categoryId: prodCat?.id,
      websiteUrl: "https://perplexity.ai",
      pricingType: "FREEMIUM" as const,
      priceStart: "Free / $20/mo",
      rating: 4.9,
      reviewCount: 1250,
      isFeatured: true,
      isVerified: true,
    },
    {
      slug: "elevenlabs-voice",
      name: "ElevenLabs",
      tagline: "State-of-the-art voice AI for speech synthesis and voice cloning",
      description: "High-fidelity, emotionally nuanced text-to-speech supporting over 30 languages with conversational latency.",
      categoryId: designCat?.id,
      websiteUrl: "https://elevenlabs.io",
      pricingType: "PAID" as const,
      priceStart: "$5/mo",
      rating: 4.8,
      reviewCount: 650,
      isFeatured: false,
      isVerified: true,
    },
  ];

  for (const tool of toolsData) {
    await prisma.aITool.upsert({
      where: { slug: tool.slug },
      update: tool,
      create: tool,
    });
  }
  console.log("✓ Seeded AI tools directory");

  // 4. Articles
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
