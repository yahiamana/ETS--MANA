"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useTranslations, useLocale } from "next-intl";

interface FeaturedProject {
  id: string;
  title: any; // Json: { en: string, fr: string, ar: string }
  category: string;
  imageUrl: string;
}

import Reveal from "@/components/ui/Reveal";

export default function PortfolioHighlight({ projects }: { projects: FeaturedProject[] }) {
  const containerRef = useRef<HTMLElement>(null);
  const t = useTranslations("Home");
  const locale = useLocale() as "en" | "fr" | "ar";

  useGSAP(() => {
    gsap.from(".portfolio-item", {
      scale: 0.95,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
      force3D: true,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 bg-muted relative overflow-hidden transition-colors">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 ltr:text-left rtl:text-right">
          <Reveal width="100%">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 md:mb-0 text-foreground">
              {t("portfolioTitle")} <span className="text-accent">{t("portfolioSubtitle")}</span>
            </h2>
          </Reveal>
          
          <Reveal delay={0.2}>
            <Link href={`/${locale}/portfolio`} className="text-sm font-bold uppercase tracking-widest text-foreground hover:text-accent transition-colors flex items-center rtl:flex-row-reverse">
              {t("exploreAll")}
              <ChevronRight className="ml-2 w-4 h-4 rtl:rotate-180 rtl:mr-2 rtl:ml-0" />
            </Link>
          </Reveal>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {projects.map((project, i) => {
              const title = project.title?.[locale] || project.title?.["en"] || "Untitled";
              return (
                <div key={project.id} className="portfolio-item group relative aspect-square overflow-hidden bg-primary border border-border">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                    style={{ backgroundImage: `url(${project.imageUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ltr:text-left rtl:text-right">
                    <span className="text-accent text-xs font-black uppercase tracking-[0.2em] mb-2">{project.category}</span>
                    <h3 className="text-white text-2xl font-bold uppercase mb-4">{title}</h3>
                    <Link href={`/${locale}/portfolio`} className="text-white/0 group-hover:text-white/100 transition-all duration-500 text-xs font-bold uppercase tracking-widest border-l-2 rtl:border-l-0 rtl:border-r-2 border-accent pl-4 rtl:pl-0 rtl:pr-4">
                      {t("viewCaseStudy")}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-secondary font-bold uppercase tracking-widest text-sm">
            {t("noFeaturedProjects")}
          </div>
        )}
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 ltr:right-0 rtl:left-0 p-24 opacity-5 select-none uppercase font-black text-[200px] leading-none pointer-events-none text-foreground">
        <Reveal width="100%" delay={0.5} duration={1.5} threshold={0}>
           MANA
        </Reveal>
      </div>
    </section>
  );
}
