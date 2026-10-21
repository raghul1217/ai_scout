import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { ToolsSection } from "@/components/home/ToolsSection";
import { LearnSection } from "@/components/home/LearnSection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { UpskillSection } from "@/components/home/UpskillSection";

export const metadata: Metadata = {
  title: "AI Scout — Discover, Learn & Stay Ahead in AI",
  description:
    "Explore curated AI tools, read the latest AI news, and learn with practical tutorials. Join the AI Scout community and stay ahead in the AI revolution.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <ToolsSection />
      <LearnSection />
      <CommunitySection />
      <UpskillSection />
    </>
  );
}
