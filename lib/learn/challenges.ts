export interface PromptItem {
  name: string;
  description?: string;
  prompt: string;
}

export interface LearnChallenge {
  id: string;
  slug: string;
  number: string;
  badge: string;
  title: string;
  industry: string;
  challenge: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  coverImage?: string; // Optional path (e.g. "/assets/learnai_bydoing/challenge1.jpg") or CDN URL
  toolsRequired: string[];
  howToComplete: string[];
  prompts: PromptItem[];
  finalSubmission: string[];
  gradient: string;
  accentColor: string;
  tags: string[];
}

export const LEARN_CHALLENGES: LearnChallenge[] = [
  {
    id: "1",
    slug: "ai-business-research-competitor-analysis",
    number: "01",
    badge: "Challenge 01",
    title: "AI Business Research & Competitor Analysis",
    industry: "Business Industry",
    challenge:
      "Imagine you want to launch a new online learning platform. Use AI tools to research the market and prepare a complete competitor analysis report.",
    difficulty: "Beginner",
    estimatedTime: "45 mins",
    coverImage: "/assets/learnai_bydoing/challenge1.jpg",
    toolsRequired: ["Perplexity AI", "ChatGPT", "Gamma AI"],
    howToComplete: [
      "Open Perplexity and research the online education market in India.",
      "Identify five competitors and research their products, pricing and target audiences.",
      "Give your research to ChatGPT.",
      "Ask ChatGPT to identify competitor strengths, weaknesses and market gaps.",
      "Ask ChatGPT to suggest a unique business positioning.",
      "Open Gamma and generate a professional market research presentation using your findings.",
    ],
    prompts: [
      {
        name: "Research prompt",
        description: "Use with Perplexity AI to collect market data & competitor intelligence",
        prompt: `Research the Indian online education industry.

Identify:
- Five major competitors.
- Their products and services.
- Target audiences.
- Pricing models.
- Market opportunities.
- Problems faced by students.

Provide sources for factual claims.`,
      },
      {
        name: "Analysis prompt",
        description: "Use with ChatGPT to extract strategic insights & unique positioning",
        prompt: `Act as a business strategy consultant.

Analyze the competitor research provided.

Identify:
1. Five market gaps.
2. Three business opportunities.
3. Target customer profiles.
4. Competitive advantages.
5. A unique positioning strategy.

Separate verified facts from assumptions.`,
      },
    ],
    finalSubmission: [
      "Competitor analysis",
      "Market opportunity report",
      "AI-generated business presentation",
    ],
    gradient: "from-purple-600/30 via-indigo-600/20 to-blue-600/10",
    accentColor: "#7C3AED",
    tags: ["Market Research", "Competitor Analysis", "Pitch Deck", "Strategy"],
  },
  {
    id: "2",
    slug: "ai-powered-social-media-marketing-campaign",
    number: "02",
    badge: "Challenge 02",
    title: "AI-Powered Social Media Marketing Campaign",
    industry: "Digital Marketing & Fashion",
    challenge:
      "Imagine a new fashion brand wants to launch on Instagram. You must create its complete seven-day marketing campaign using AI.",
    difficulty: "Intermediate",
    estimatedTime: "60 mins",
    coverImage: "/assets/learnai_bydoing/challenge2.jpg",
    toolsRequired: ["ChatGPT", "Leonardo AI", "Canva AI", "InVideo AI"],
    howToComplete: [
      "Use ChatGPT to identify the target audience and create a marketing strategy.",
      "Generate seven days of Instagram content ideas.",
      "Use Leonardo AI to generate fashion promotional images.",
      "Use Canva AI to create Instagram advertisements.",
      "Use InVideo AI to create a promotional video from a text prompt.",
      "Use ChatGPT to generate captions, hashtags and calls to action.",
      "Ask ChatGPT to prepare a campaign performance measurement plan.",
    ],
    prompts: [
      {
        name: "Campaign Strategy Prompt",
        description: "Use with ChatGPT to generate the 7-day marketing plan & creative assets",
        prompt: `Act as a professional social media marketing manager.

Create a seven-day Instagram marketing campaign for a new fashion brand targeting college students.

Generate:
- Seven post concepts.
- Five promotional captions.
- Ten relevant hashtags.
- Three Reel scripts.
- Three advertising headlines.
- Target audience profile.
- Marketing strategy.

Make the campaign creative and practical.`,
      },
    ],
    finalSubmission: [
      "Seven-day content calendar",
      "Three AI-generated promotional designs",
      "One AI-generated promotional video",
      "Captions and hashtags",
    ],
    gradient: "from-pink-600/30 via-rose-600/20 to-amber-600/10",
    accentColor: "#EC4899",
    tags: ["Content Creation", "Visual AI", "Video Gen", "Instagram"],
  },
  {
    id: "3",
    slug: "build-ai-customer-support-chatbot",
    number: "03",
    badge: "Challenge 03",
    title: "Build an AI Customer Support Chatbot",
    industry: "Customer Service Industry",
    challenge:
      "Build an AI customer support chatbot for a fictional e-commerce company that can answer customer questions using company information.",
    difficulty: "Advanced",
    estimatedTime: "90 mins",
    coverImage: "/assets/learnai_bydoing/challenge3.jpg",
    toolsRequired: ["ChatGPT", "Chatbase", "Claude"],
    howToComplete: [
      "Ask ChatGPT to create a fictional e-commerce company profile.",
      "Generate 20 frequently asked questions and answers.",
      "Create fictional delivery, refund, cancellation and return policies.",
      "Use Claude to review and improve the knowledge base.",
      "Upload the document to Chatbase.",
      "Configure the chatbot using its AI setup options.",
      "Test the chatbot with 10 different customer questions.",
      "Improve its answers if it gives incorrect information.",
    ],
    prompts: [
      {
        name: "Knowledge Base Generation Prompt",
        description: "Use with ChatGPT / Claude to author a realistic e-commerce knowledge base",
        prompt: `Act as an e-commerce customer support manager.

Create a complete knowledge base for a fictional online shopping company.

Include:
- 20 customer FAQs.
- Delivery information.
- Return policies.
- Refund policies.
- Payment information.
- Cancellation process.
- Warranty information.

Use clear and professional language.
Label all policies as fictional.`,
      },
    ],
    finalSubmission: [
      "AI-generated company knowledge base",
      "Working AI chatbot",
      "Ten chatbot test conversations",
      "Final chatbot demonstration",
    ],
    gradient: "from-cyan-600/30 via-blue-600/20 to-emerald-600/10",
    accentColor: "#06B6D4",
    tags: ["AI Chatbots", "Knowledge Base", "Chatbase", "Customer Ops"],
  },
];

