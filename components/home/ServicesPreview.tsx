"use client";

import { useRef } from "react";
import Link from "next/link";
import { Hammer, Drill, Settings2, Construction, Info, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useTranslations, useLocale } from "next-intl";

import Reveal from "@/components/ui/Reveal";

export default function ServicesPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Home");
  const ts = useTranslations("Services");
  const locale = useLocale();

  const services = [
    {
      icon: Drill,
      title: ts("machiningTitle"),
      desc: ts("machiningDesc"),
      href: `/${locale}/services#machining`
    },
    {
      icon: Construction,
      title: ts("restorationTitle"),
      desc: ts("restorationDesc"),
      href: `/${locale}/services#restoration`
    },
    {
      icon: Settings2,
      title: ts("modificationTitle"),
      desc: ts("modificationDesc"),
      href: `/${locale}/services#modification`
    },
    {
      icon: Hammer,
      title: ts("manufacturingTitle"),
      desc: ts("manufacturingDesc"),
      href: `/${locale}/services#manufacturing`
    },
    {
      icon: Info,
      title: ts("guidanceTitle"),
      desc: ts("guidanceDesc"),
      href: `/${locale}/services#guidance`
    },
  ];

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.fromTo(".service-card", 
      { 
        opacity: 0, 
        y: 40 
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%", // Trigger slightly earlier
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section className="py-24 bg-background border-y border-border transition-colors">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 ltr:text-left rtl:text-right">
          <div className="max-w-2xl">
            <Reveal width="100%">
              <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 tracking-tight text-foreground">
                {t("servicesTitle")} <span className="text-secondary">{t("servicesSubtitle")}</span>
              </h2>
            </Reveal>
            <Reveal width="100%" delay={0.2}>
              <p className="text-secondary text-lg">
                {t("servicesDesc")}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.3}>
            <Link 
              href={`/${locale}/services`} 
              className="group flex items-center space-x-2 rtl:space-x-reverse text-foreground font-bold uppercase tracking-widest text-sm border-b-2 border-foreground pb-2"
            >
              <span>{t("viewAll")}</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform rtl:group-hover:-translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-border border border-border">
          {services.map((service, i) => (
            <div key={i} className="service-card group bg-background p-10 hover:bg-primary transition-colors duration-500">
              <div className="bg-muted p-4 w-16 h-16 flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-primary-foreground transition-colors duration-500">
                <service.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold uppercase mb-4 text-foreground group-hover:text-primary-foreground transition-colors">
                {service.title}
              </h3>
              <p className="text-secondary text-sm leading-relaxed mb-8 group-hover:text-primary-foreground/70 transition-colors">
                {service.desc}
              </p>
              <Link 
                href={service.href}
                className="inline-flex items-center text-xs font-black uppercase tracking-widest text-accent group-hover:text-primary-foreground transition-colors"
              >
                {t("learnMore")}
                <ChevronRight className="ml-1 w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
