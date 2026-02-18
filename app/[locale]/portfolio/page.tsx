import prisma from "@/lib/prisma";
import PortfolioGallery from "@/components/portfolio/PortfolioGallery";
import { cache } from "react";

// Caching the database query for performance
const getProjects = cache(async () => {
  return await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      category: true,
      imageUrl: true,
    }
  });
});

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const projects = await getProjects();
  const categories = ["All", ...Array.from(new Set(projects.map((p: { category: string }) => p.category)))];

  return (
    <div className="bg-background transition-colors">
      {/* Header - Server Rendered Static Content */}
      <section className="bg-primary pt-32 pb-20 text-primary-foreground industrial-grid">
        <div className="container mx-auto px-6">
          <span className="text-accent font-bold uppercase tracking-[0.3em] text-xs mb-4 block underline decoration-accent/30 decoration-2 underline-offset-4">Proven Performance</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 leading-none">
            Project <br /><span className="text-primary-foreground/50">Portfolio</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-2xl text-lg leading-relaxed">
            A visual record of our commitment to precision. Every project represents 
            a mechanical challenge solved with technical expertise.
          </p>
        </div>
      </section>

      {/* Gallery - Client Component for interaction */}
      <PortfolioGallery projects={projects} categories={categories} />
    </div>
  );
}
