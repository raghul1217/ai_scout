import newsData from "@/data/featured-news.json";

export interface FeaturedSectionHeader {
  badge: string;
  title: string;
  description: string;
  viewAllText: string;
  viewAllHref: string;
}

export interface FeaturedArticle {
  id: string;
  slug: string;
  type: "news";
  accessLevel: "FREE" | "PREMIUM";
  title: string;
  subtitle?: string;
  summary: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  date: string;
  readTimeMinutes: number;
  imageUrl: string;
  imageAlt: string;
  badge: "Breaking" | "Incident" | "Analysis";
  authorName: string;
  authorRole: string;
  tags: string[];
  sections: {
    heading?: string;
    paragraphs: string[];
    bulletPoints?: { label: string; text: string }[];
    callout?: {
      type: "warning" | "info" | "insight";
      title: string;
      text: string;
    };
  }[];
}

export const FEATURED_SECTION_HEADER: FeaturedSectionHeader = newsData.sectionHeader;
export const FEATURED_ARTICLES: FeaturedArticle[] = newsData.articles as FeaturedArticle[];

export function getFeaturedArticleBySlug(slug: string): FeaturedArticle | undefined {
  return FEATURED_ARTICLES.find((article) => article.slug === slug);
}
