import vaultJson from "@/data/premium-vault.json";

export interface PremiumActionLink {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

export interface PremiumBulletPoint {
  label: string;
  text: string;
}

export interface PremiumSectionImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface PremiumRepoLink {
  name: string;
  badge: string;
  description: string;
  url: string;
}

export interface PremiumCallout {
  type: "warning" | "insight" | "info";
  title: string;
  text: string;
}

export interface PremiumArticleSection {
  heading?: string;
  paragraphs?: string[];
  bulletPoints?: PremiumBulletPoint[];
  images?: PremiumSectionImage[];
  links?: PremiumRepoLink[];
  codeBlock?: string;
  callout?: PremiumCallout;
}

export interface PremiumArticle {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  category: string;
  categorySlug: string;
  badge: string;
  authorName: string;
  date: string;
  readTimeMinutes: number;
  coverImage: string;
  coverImageAlt: string;
  tags: string[];
  primaryActions?: PremiumActionLink[];
  sections: PremiumArticleSection[];
}

export interface PremiumToolOfTheWeek {
  number: string;
  name: string;
  tag: string;
  accent: "blue" | "amber" | "emerald";
  description: string;
  url: string;
}

interface PremiumVaultData {
  articles: PremiumArticle[];
  toolsOfTheWeek: PremiumToolOfTheWeek[];
}

const data = vaultJson as PremiumVaultData;

export function getPremiumArticles(): PremiumArticle[] {
  return data.articles;
}

export function getPremiumArticleBySlug(slug: string): PremiumArticle | undefined {
  return data.articles.find((article) => article.slug === slug);
}

export function getPremiumCategories(): { name: string; slug: string }[] {
  const seen = new Map<string, string>();
  for (const article of data.articles) {
    if (!seen.has(article.categorySlug)) {
      seen.set(article.categorySlug, article.category);
    }
  }
  return Array.from(seen.entries()).map(([slug, name]) => ({ slug, name }));
}

export function getToolsOfTheWeek(): PremiumToolOfTheWeek[] {
  return data.toolsOfTheWeek;
}
