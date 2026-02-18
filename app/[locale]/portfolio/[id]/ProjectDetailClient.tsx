"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Tag, Calendar, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface ProjectDetailClientProps {
  project: any;
  locale: string;
  title: string;
  description: string;
  tc_back: string;
  t_desc: string;
  t_classification: string;
  t_completion: string;
  t_cta: string;
}

export function ProjectDetailClient({ 
  project, 
  locale, 
  title, 
  description, 
  tc_back,
  t_desc,
  t_classification,
  t_completion,
  t_cta
}: ProjectDetailClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(".detail-nav", { y: -20, opacity: 0, duration: 0.6, ease: "power2.out" })
      .from(".detail-image", { x: -30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
      .from(".detail-content > *", { 
        y: 20, 
        opacity: 0, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power2.out" 
      }, "-=0.5");
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground transition-colors overflow-x-hidden">
      {/* Dynamic Header / Breadcrumb */}
      <nav className="detail-nav bg-primary/5 border-b border-border pt-32 pb-6 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link
            href={`/${locale}/portfolio`}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-secondary hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{tc_back}</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/40">
            <span>Portfolio</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{project.category}</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column: Visual Content */}
          <div className="detail-image lg:col-span-7 space-y-8">
            <div className="relative aspect-[4/3] md:aspect-video overflow-hidden border-8 border-muted shadow-2xl group">
              <div className="absolute inset-0 border-[12px] border-[#1a202c]/50 z-20 pointer-events-none" />
              <div className="absolute top-2 left-2 w-3 h-3 bg-accent z-30" />
              <div className="absolute top-2 right-2 w-3 h-3 bg-accent z-30" />
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-accent z-30" />
              <div className="absolute bottom-2 right-2 w-3 h-3 bg-accent z-30" />
              
              <Image
                src={project.imageUrl}
                alt={title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Technical Details */}
          <div className="detail-content lg:col-span-5 space-y-12 ltr:text-left rtl:text-right">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-accent" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">
                  {project.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight">
                {title}
              </h1>
            </div>

            <div className="space-y-8 bg-muted/30 p-8 border-l-4 border-accent relative overflow-hidden">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none industrial-grid" />
              
              <div className="relative z-10 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40 border-b border-border pb-4">
                  {t_desc}
                </h3>
                <p className="text-lg text-secondary leading-relaxed whitespace-pre-wrap">
                  {description || "A technical implementation focusing on precision engineering and industrial durability, tailored to client specifications."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border mt-8">
                <div className="space-y-2">
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                    <Tag className="w-3 h-3 text-accent" />
                    {t_classification}
                  </span>
                  <p className="font-bold uppercase text-sm">{project.category}</p>
                </div>
                <div className="space-y-2">
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                    <Calendar className="w-3 h-3 text-accent" />
                    {t_completion}
                  </span>
                  <p className="font-bold uppercase text-sm">
                    {new Date(project.createdAt).toLocaleDateString(locale, { year: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-4 bg-primary text-primary-foreground px-10 py-5 font-black uppercase tracking-widest text-xs hover:bg-accent transition-all group"
              >
                <span>{t_cta}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-20 border-t border-border flex flex-col md:flex-row gap-8 items-center justify-between opacity-50 grayscale">
            <div className="flex gap-12">
               <div className="text-center">
                  <span className="block text-2xl font-black">01</span>
                  <span className="text-[10px] uppercase tracking-widest">Precision Analysis</span>
               </div>
               <div className="text-center">
                  <span className="block text-2xl font-black">02</span>
                  <span className="text-[10px] uppercase tracking-widest">Material Selection</span>
               </div>
               <div className="text-center">
                  <span className="block text-2xl font-black">03</span>
                  <span className="text-[10px] uppercase tracking-widest">Final Machining</span>
               </div>
            </div>
            <div className="text-[10px] font-mono opacity-40">
               REF_ID: {project.id.slice(0, 8).toUpperCase()} // MANA_INDUSTRIAL_PORTFOLIO
            </div>
        </div>
      </div>
    </div>
  );
}
