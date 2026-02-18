import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import ServicesPreview from "@/components/home/ServicesPreview";
import PortfolioHighlight from "@/components/home/PortfolioHighlight";
import CTASection from "@/components/home/CTASection";
import { getSiteSettings } from "@/lib/settings";
import prisma from "@/lib/prisma";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settings = await getSiteSettings();

  // Fetch the 3 most recent portfolio projects for the Featured Work section
  const featuredProjects = await prisma.project.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, category: true, imageUrl: true },
  });

  return (
    <div className="flex flex-col w-full">
      <Hero settings={settings} />
      <Intro settings={settings} />
      <ServicesPreview />
      <PortfolioHighlight projects={featuredProjects} />
      <CTASection settings={settings} />
    </div>
  );
}
