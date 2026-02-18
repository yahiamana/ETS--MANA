"use client";

import { useRef } from "react";
import Image from "next/image";
import { Settings, Shield, Award } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

import { useTranslations } from "next-intl";

import Reveal from "@/components/ui/Reveal";

export default function Intro({ settings }: { settings: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const t = useTranslations("Home");

  useGSAP(() => {
    gsap.from(".intro-card", {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      }
    });
  }, { scope: sectionRef });

  const features = [
    { icon: Settings, title: t("feature1Title"), desc: t("feature1Desc") },
    { icon: Shield, title: t("feature2Title"), desc: t("feature2Desc") },
    { icon: Award, title: t("feature3Title"), desc: t("feature3Desc") },
  ];

  const imageUrl = settings.introImageUrl || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80";

  return (
    <section ref={sectionRef} className="py-24 bg-muted industrial-grid transition-colors">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center ltr:text-left rtl:text-right">
          <div className="w-full md:w-1/2">
            <Reveal width="100%">
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-8 leading-tight text-foreground">
                {t("introTitle")} <span className="text-accent">{t("introSubtitle")}</span>
              </h2>
            </Reveal>
            
            <Reveal width="100%" delay={0.2}>
              <p className="text-secondary text-lg mb-10 leading-relaxed">
                {t("introDesc")}
              </p>
            </Reveal>
            
            <div className="grid grid-cols-1 gap-6">
              {features.map((item, i) => (
                <div key={i} className="intro-card flex items-start space-x-4 rtl:space-x-reverse bg-background p-6 border border-border shadow-sm">
                  <div className="bg-primary/5 p-3 text-accent transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-wide text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-secondary line-clamp-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
            <Reveal width="100%" threshold={0.3}>
              <div className="aspect-[4/5] bg-primary relative overflow-hidden border-[12px] border-background shadow-2xl transition-all">
                <Image 
                  src={imageUrl}
                  alt="Industrial workshop"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover grayscale contrast-125 opacity-80"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/20 dark:bg-primary/40" />
              </div>
            </Reveal>
            
            {/* Stats Overlay */}
            <Reveal delay={0.4} threshold={0.5}>
              <div className="absolute -bottom-10 ltr:-left-10 rtl:-right-10 bg-accent text-white p-10 hidden lg:block shadow-xl">
                <div className="text-5xl font-black mb-2">{t("statsValue")}</div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">{t("statsTitle")}</div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
