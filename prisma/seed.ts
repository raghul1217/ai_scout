import { PrismaClient } from "@prisma/client";
import { BEST_OF_AI_TOOLS } from "../lib/tools/bestofai";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Savzyen database...");

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

  // 2. Plans (Free & ₹499 SAVZYEN Premium)
  const plansData = [
    {
      name: "Savzyen Free",
      slug: "free",
      description: "Essential AI tool directory and curated daily updates.",
      price: 0,
      currency: "INR",
      billingType: "ONE_TIME" as const,
      durationDays: null,
      isActive: true,
      features: [
        "AI Updates Daily 1",
        "Weekly 1 news",
      ],
      sortOrder: 1,
    },
    {
      name: "SAVZYEN Premium",
      slug: "pro",
      description: "Stay Ahead. Learn Faster. Build Smarter.",
      price: 49900, // ₹499.00
      currency: "INR",
      billingType: "YEARLY" as const,
      durationDays: 365,
      isActive: true,
      features: [
        "Daily AI News & Industry Updates",
        "Latest AI Tools & Feature Discoveries",
        "Practical AI Daily Challenges with Tutorials & Learning Resources",
        "Industry Insights & Weekly Reports",
        "Weekly AI Challenges",
        "Tech Events, Meetups & Conferences",
        "Exclusive Live Sessions with Founders & Experts",
        "Exclusive Learning & Career Opportunities",
        "GitHub News, Projects & Trending Repositories",
        "Build Real-Time AI Agents & Practical Modules",
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
      slug: "microsoft-cloud-outage-global-workplace-disruption",
      title: "Major Microsoft 365 Cloud Outage Triggers Global Workplace Disruption",
      summary: "What began as an isolated Outlook glitch quickly cascaded into an infrastructure failure across Teams, SharePoint, and Copilot.",
      content: `### A Cascading Failure Across Global Workplaces\n\nMicrosoft's cloud infrastructure suffered a severe multi-hour outage that quickly morphed from an isolated email delivery delay into a sweeping workplace shutdown. What initially presented as a mailbox connectivity issue in Outlook rapidly cascaded across the Microsoft 365 suite, leaving businesses unable to conduct core operations.\n\n#### Impacted Systems\n\n- **Outlook & Exchange Online**: Users faced persistent mailbox access errors and massive delays in email delivery.\n- **Microsoft Teams**: Calendar and meeting scheduling disrupted.\n- **SharePoint & OneDrive**: Cloud storage and collaborative document features failed.\n- **Microsoft 365 Copilot**: Complete failure to load contextual prompts and work graphs.\n\n#### Why Recovery Took Time\n\nSeveral backend server clusters unexpectedly became unresponsive. When engineers brought nodes back online, the sudden surge in reconnection traffic overwhelmed them once again in a cascading thundering-herd loop. Microsoft adjusted infrastructure traffic routing and rebalanced gateways to stabilize services.`,
      coverImage: "/assets/feature_section/microsoft.png",
      categoryId: devCat?.id,
      status: "PUBLISHED" as const,
      accessLevel: "FREE" as const,
      readTimeMinutes: 5,
      publishedAt: new Date(),
    },
    {
      slug: "claude-server-down-authentication-incident-analysis",
      title: "Claude Service Down: Unexpected Authentication Failures Hit Claude.ai & Claude Code",
      summary: "Anthropic investigates platform-wide authentication breakdowns as users encounter 'Sign In Again' errors and service unavailability.",
      content: `### The Incident: Service Temporarily Unavailable\n\nClaude unexpectedly stopped responding for thousands of engineers and researchers. On the web client at Claude.ai, users were greeted with 'Service temporarily unavailable', while desktop and CLI clients displayed 'Authentication failed. Sign in again to continue.'\n\n#### Product Design Teardown\n\nDuring authentication gateway failures, prompting users to repeatedly re-enter their credentials causes confusion. A direct, real-time platform status link inside the dialog saves user frustration and clarifies whether the issue is local or global.`,
      coverImage: "/assets/feature_section/claude_issue.png",
      categoryId: devCat?.id,
      status: "PUBLISHED" as const,
      accessLevel: "FREE" as const,
      readTimeMinutes: 4,
      publishedAt: new Date(),
    },
    {
      slug: "nvidia-board-names-colette-kress-interim-ceo",
      title: "NVIDIA Names CFO Colette Kress as Interim CEO; Board Appoints Harvey Jones as Chair",
      summary: "NVIDIA’s board of directors initiates a historic leadership transition, appointing 13-year CFO veteran Colette Kress to lead the semiconductor giant.",
      content: `### Leadership Restructuring at NVIDIA\n\nIn a landmark announcement, NVIDIA’s board named Executive Vice President and Chief Financial Officer Colette Kress as interim Chief Executive Officer while conducting a search for a permanent successor.\n\n#### Board Chair & Candidates\n\nHarvey C. Jones has been appointed as the first-ever Chair of the Board. Longtime CFO Colette Kress and VP of Hyperscale Computing Ian Buck are viewed by industry observers as key frontrunners for the permanent leadership post.`,
      coverImage: "/assets/feature_section/nvdia_issue.png",
      categoryId: devCat?.id,
      status: "PUBLISHED" as const,
      accessLevel: "FREE" as const,
      readTimeMinutes: 4,
      publishedAt: new Date(),
    },
    {
      slug: "openai-launches-operator-autonomous-browser-agent",
      title: "OpenAI Unveils 'Operator': Autonomous Agent for Web & Browser Execution",
      summary: "OpenAI has officially launched Operator, an autonomous AI agent capable of navigating browser windows, executing software tasks, and carrying out multi-step commercial workflows.",
      content: `### From Chatbots to Computer-Executing Agents\n\nOpenAI has released 'Operator', a specialized agentic system designed to take direct action inside graphical user interfaces (GUIs). Unlike traditional API integrations, Operator visually perceives the screen, plans multi-step journeys, clicks buttons, types in forms, and navigates websites autonomously.\n\n#### Native Browser Navigation\n\nExecutes complex workflows like comparing prices, filling forms, and completing transactions with visual coordinate grounding and human-in-the-loop safeguards.`,
      coverImage: "/assets/feature_section/operator_agent.png",
      categoryId: devCat?.id,
      status: "PUBLISHED" as const,
      accessLevel: "FREE" as const,
      readTimeMinutes: 5,
      publishedAt: new Date(),
    },
    {
      slug: "google-deepmind-launches-gemini-2-0-multimodal-live-api",
      title: "Google DeepMind Launches Gemini 2.0 with Real-Time Multimodal Live API",
      summary: "Google DeepMind announced Gemini 2.0, introducing real-time bidirectional multimodal audio and video streaming, agentic function calling, and the new Flash Thinking model.",
      content: `### A Quantum Leap in Real-Time AI Interaction\n\nGoogle DeepMind has unleashed Gemini 2.0, establishing a new frontier for real-time interactive artificial intelligence. Headlined by Gemini 2.0 Flash, the release delivers bidirectional audio and video streaming over WebSockets with latency approaching natural human speech thresholds.\n\n#### Multimodal Live API\n\nSub-400ms end-to-end voice and video processing with native interruption support, spatial perception, and seamless external tool orchestration.`,
      coverImage: "/assets/feature_section/gemini_2_flash.png",
      categoryId: devCat?.id,
      status: "PUBLISHED" as const,
      accessLevel: "FREE" as const,
      readTimeMinutes: 6,
      publishedAt: new Date(),
    },
    {
      slug: "deepseek-v3-open-weights-ai-frontier-economics",
      title: "DeepSeek-V3 Open-Weights Architecture Disrupts Frontier Model Economics",
      summary: "DeepSeek has open-sourced DeepSeek-V3, a 671B parameter Mixture-of-Experts model that matches leading closed frontier models at a fraction of training and inference cost.",
      content: `### The Architectural Miracle from DeepSeek\n\nDeepSeek has sent shockwaves through the global AI landscape with DeepSeek-V3, a flagship 671B parameter Mixture-of-Experts (MoE) foundation model activating just 37B parameters per token, trained for under $6 million USD.\n\n#### Multi-Head Latent Attention & DualPipe\n\nCompresses KV cache overhead by orders of magnitude while utilizing 256 fine-grained routing experts, democratizing frontier intelligence for researchers worldwide.`,
      coverImage: "/assets/feature_section/deepseek_v3.png",
      categoryId: devCat?.id,
      status: "PUBLISHED" as const,
      accessLevel: "FREE" as const,
      readTimeMinutes: 5,
      publishedAt: new Date(),
    },
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
