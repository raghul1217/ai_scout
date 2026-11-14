import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
// import { CollaboratorMarquee } from "@/components/home/CollaboratorMarquee";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { ToolsSection } from "@/components/home/ToolsSection";
import { LearnSection } from "@/components/home/LearnSection";
import { UpskillSection } from "@/components/home/UpskillSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

export const metadata: Metadata = {
  title: "Savzyen — Discover, Learn & Stay Ahead in AI",
  description:
    "Explore curated AI tools, read the latest AI news, and learn with practical tutorials. Join the Savzyen community and stay ahead in the AI revolution.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {/* <CollaboratorMarquee /> */}
      <FeaturedSection />
      <ToolsSection />
      <LearnSection />
      <TestimonialsSection />
      <UpskillSection />
    </>
  );
}
