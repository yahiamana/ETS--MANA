"use client";

import { useRef } from "react";
import { ShieldCheck, Zap, Crosshair, Users } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { useScrollVelocity } from "@/hooks/useScrollPipeline";

export default function AboutClient({ settings }: { settings: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("About");

  // ─── 1. Velocity-Aware Skew Effect ─────────────────────────────────────────
  const velocity = useScrollVelocity(); // Live scroll velocity ref

  useGSAP(() => {
    // Add a ticker update to skew elements based on scroll speed
    // This runs on every frame but only reads the ref (no React renders)
    const updateSkew = () => {
      const skew = Math.min(Math.max(velocity.current * 0.05, -5), 5); // Clamp skew
      
      // Apply skew to content blocks for dynamic feel
      gsap.set(".velocity-skew", { 
        skewY: skew,
        force3D: true, // Force GPU layer
        overwrite: "auto"
      });
    };

    gsap.ticker.add(updateSkew);

    return () => {
      gsap.ticker.remove(updateSkew);
      gsap.set(".velocity-skew", { skewY: 0 }); // Reset on unmount
    };
  }, { scope: containerRef });

  // ─── 2. Scroll-Driven Reveal Timelines ─────────────────────────────────────
  useGSAP(() => {
    // Story Section: Parallax Reveal
    gsap.from(".story-image", {
      y: 100,
      scale: 1.1,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: storyRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });

    gsap.from(".story-content > *", {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: storyRef.current,
        start: "top 75%",
      }
    });

    // Values Section: Staggered Cards
    gsap.from(".value-card", {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power4.out",
      scrollTrigger: {
        trigger: valuesRef.current,
        start: "top 80%",
      }
    });

    // Visual Break: Parallax Background
    // We use a scrub timeline here for precise scroll control
    gsap.fromTo(".break-bg", 
      { y: 0, scale: 1 },
      { 
        y: 200, 
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: ".visual-break",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );

  }, { scope: containerRef });

  const storyImg = settings.aboutStoryUrl || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80";
  const breakImg = settings.aboutVisualBreakUrl || "https://images.unsplash.com/photo-1534394017411-94943f65017e?auto=format&fit=crop&q=80";
  const siteName = settings.siteName || "MANA";

  const values = [
    { icon: Crosshair, title: t("precisionTitle"), desc: t("precisionDesc") },
    { icon: ShieldCheck, title: t("reliabilityTitle"), desc: t("reliabilityDesc") },
    { icon: Zap, title: t("efficiencyTitle"), desc: t("efficiencyDesc") },
    { icon: Users, title: t("partnershipTitle"), desc: t("partnershipDesc") },
  ];

  return (
    <div ref={containerRef} className="bg-background transition-colors perspective-1000">
      {/* Page Header */}
      <section className="bg-primary pt-32 pb-20 text-primary-foreground">
        <div className="container mx-auto px-6">
          <span className="text-accent font-bold uppercase tracking-[0.3em] text-xs mb-4 block velocity-skew">{t("ourLegacy")}</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 leading-none velocity-skew">
            {t("builtOn")} <br />
            <span className="text-primary-foreground/60">{t("reliability")}</span>
          </h1>
        </div>
      </section>

      {/* Story Section */}
      <section ref={storyRef} className="py-24 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2">
              <div className="story-image aspect-square bg-muted relative overflow-hidden group">
                <div 
                  className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" 
                  style={{ backgroundImage: `url(${storyImg})` }}
                />
                <div className="absolute inset-0 bg-primary/10" />
              </div>
            </div>
            <div className="w-full md:w-1/2 story-content">
              <h2 className="text-3xl md:text-4xl font-black uppercase mb-8 velocity-skew">
                {t("workshopStoryTitle")} <span className="text-accent">{siteName}</span>
              </h2>
              <div className="space-y-6 text-secondary text-lg leading-relaxed velocity-skew">
                <p>
                  {t("storyPara1")}
                </p>
                <p>
                  {t("storyPara2")}
                </p>
                <p>
                  {t("storyPara3")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-24 bg-muted industrial-grid">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 velocity-skew">
            <h2 className="text-4xl font-black uppercase mb-6">{t("coreValues")}</h2>
            <p className="text-secondary leading-relaxed">
              {t("coreValuesDesc")} {siteName} {t("coreValuesDescSuffix")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <div key={i} className="value-card velocity-skew bg-card p-10 border border-border hover:border-accent transition-colors will-change-transform">
                <div className="text-accent mb-6">
                  <value.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold uppercase mb-4 text-primary">{value.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industrial Visual Break */}
      <section className="visual-break h-[50vh] relative overflow-hidden">
        <div 
          className="break-bg absolute inset-0 bg-cover bg-fixed bg-center grayscale will-change-transform" 
          style={{ backgroundImage: `url(${breakImg})` }}
        />
        <div className="absolute inset-0 bg-primary/60 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h2 className="velocity-skew text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-white">{t("visualBreakTitle")}</h2>
            <div className="w-24 h-1 bg-accent mx-auto" />
          </div>
        </div>
      </section>
    </div>
  );
}
