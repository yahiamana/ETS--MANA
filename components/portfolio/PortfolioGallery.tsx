"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useLocale } from "next-intl";

export interface Project {
  id: string;
  title: any; // { en: string, fr: string, ar: string }
  category: string;
  imageUrl: string;
}

interface PortfolioGalleryProps {
  projects: Project[];
  categories: string[];
}

export default function PortfolioGallery({ projects, categories }: PortfolioGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale() as "en" | "fr" | "ar";

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  useGSAP(() => {
    // Highly optimized GSAP animation - using simple opacity/scale
    gsap.fromTo(".project-card", 
      { opacity: 0, scale: 0.98 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        overwrite: "auto",
        clearProps: "transform"
      }
    );
  }, [activeCategory]);

  return (
    <>
      {/* Filters */}
      <div className="sticky top-[73px] z-40 bg-background/80 backdrop-blur-md border-b border-border py-6 transition-all duration-300">
        <div className="container mx-auto px-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2 text-xs font-bold uppercase tracking-widest border transition-all",
                  activeCategory === cat 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-transparent text-secondary border-border hover:border-primary/50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center text-secondary text-xs font-bold uppercase tracking-widest gap-2">
            <Filter className="w-4 h-4" />
            <span>Showing {filteredProjects.length} Projects</span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <Link 
                key={project.id} 
                href={`/${locale}/portfolio/${project.id}`}
                className="project-card group bg-muted border border-border flex flex-col overflow-hidden will-change-transform cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden bg-[#0a0c10]">
                  {/* High-Performance Industrial Frame (CSS) */}
                  <div className="absolute inset-0 border-[12px] border-[#1a202c] z-20 pointer-events-none" />
                  <div className="absolute top-2 left-2 w-2 h-2 bg-accent z-30" />
                  <div className="absolute top-2 right-2 w-2 h-2 bg-accent z-30" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-accent z-30" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 bg-accent z-30" />
                  
                  <div className="absolute inset-0 z-10 grayscale hover:grayscale-0 transition-all duration-700">
                    <Image 
                      src={project.imageUrl}
                      alt={project.title[locale] || project.title['en']}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index <= 3}
                    />
                  </div>
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1 text-[10px] font-black uppercase tracking-widest text-foreground border border-border">
                    {project.category}
                  </div>
                </div>
                
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div className="ltr:text-left rtl:text-right">
                    <h3 className="text-xl font-bold uppercase mb-2 text-foreground group-hover:text-accent transition-colors">
                      {project.title[locale] || project.title['en']}
                    </h3>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-border flex items-center justify-between group/link">
                    <span className="text-xs font-black uppercase tracking-widest text-foreground/40 group-hover:text-foreground transition-colors">Details</span>
                    <div className="bg-primary text-primary-foreground p-2 group-hover/link:bg-accent transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="py-32 text-center">
          <p className="text-secondary font-bold uppercase tracking-widest">No projects found in this category.</p>
        </div>
      )}
    </>
  );
}
