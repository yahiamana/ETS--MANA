"use client";

import { useRef } from "react";
import { ArrowRight, CheckCircle2, LucideIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";

const MachiningGrid = dynamic(() => import("@/components/visuals/MachiningGrid"), { ssr: false });
const Canvas = dynamic(() => import("@react-three/fiber").then(mod => mod.Canvas), { ssr: false });

interface Service {
  id: string;
  title: string;
  desc: string;
  features: string[];
  image: string;
  // icon is handled by mapping string name to component in real impl, 
  // but for simplicity here we'll assume the icons are passed as components or keys.
  iconName: string; 
}

// Map of icon names to components to keep it serializable across RSC boundary
import { Drill, Hammer, Settings2, Construction, ShieldCheck } from "lucide-react";
const IconMap: { [key: string]: LucideIcon } = {
  machining: Drill,
  repair: Construction,
  fabrication: Hammer,
  modification: Settings2,
  manufacturing: Drill,
  restoration: Construction,
  guidance: ShieldCheck,
};

interface ServicesGalleryProps {
  services: Service[];
  settings: any;
}

import { useLocale, useTranslations } from "next-intl";

export default function ServicesGallery({ services, settings }: ServicesGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations("Services");
  const tc = useTranslations("Common");

  const serviceImageMap: { [key: string]: string | null } = {
    machining: settings.servicesMachiningUrl,
    repair: settings.servicesRepairUrl,
    fabrication: settings.servicesFabricationUrl,
    modification: settings.servicesModificationUrl,
    manufacturing: settings.servicesManufacturingUrl || settings.servicesMachiningUrl,
    restoration: settings.servicesRestorationUrl || settings.servicesRepairUrl,
    guidance: settings.servicesGuidanceUrl,
  };

  const localizedServices = services.map(s => {
    const features = [];
    for (let i = 1; i <= 4; i++) {
        const key = `${s.id}Feature${i}`;
        if (t.has(key)) {
            const feature = t.raw(key);
            if (feature && !feature.startsWith('Services.')) {
                features.push(feature);
            }
        }
    }

    return {
      ...s,
      title: t(`${s.id}Title`),
      desc: t(`${s.id}Desc`),
      image: serviceImageMap[s.id] || s.image,
      features
    };
  });

  useGSAP(() => {
    gsap.from(".service-section", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      force3D: true,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="transition-colors duration-300">
      {/* Header Visual */}
      <section className="relative bg-primary pt-32 pb-20 text-primary-foreground overflow-hidden transition-colors">
        <div className="absolute inset-0 z-0 opacity-20">
          <Canvas 
            camera={{ position: [0, 5, 10], fov: 45 }}
            gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
            dpr={[1, 1.5]}
          >
            <ambientLight intensity={0.5} />
            <MachiningGrid />
          </Canvas>
        </div>
        <div className="container mx-auto px-6 relative z-10 ltr:text-left rtl:text-right">
          <span className="text-accent font-bold uppercase tracking-[0.3em] text-xs mb-4 block underline decoration-accent/30 decoration-2 underline-offset-4">
            {t("expertHeader")}
          </span>
          <h1 className="text-4xl md:text-7xl font-black uppercase mb-6 leading-tight transition-colors">
            {t("mainTitle")} <br /><span className="text-primary-foreground/40">{t("mainSubtitle")}</span>
          </h1>
          <p className="text-primary-foreground/70 max-w-2xl text-lg leading-relaxed transition-colors">
            {t("mainDesc")}
          </p>
        </div>
      </section>

      {/* detailed Services */}
      <div className="py-16 md:py-24 space-y-16 md:space-y-32">
        {localizedServices.map((service, i) => {
          const Icon = IconMap[service.id] || Drill;
          const isEven = i % 2 === 0;
          return (
            <section key={service.id} id={service.id} className="service-section container mx-auto px-6 will-change-transform">
              <div className={cn(
                "flex flex-col gap-16 items-center",
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              )}>
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-video overflow-hidden border-8 border-muted shadow-2xl transition-all">
                    <Image 
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-100 hover:scale-105 opacity-90"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={i === 0}
                    />
                    <div className="absolute inset-0 bg-primary/20 pointer-events-none z-10 dark:bg-primary/40" />
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 ltr:text-left rtl:text-right">
                  <div className="bg-primary/5 p-4 w-16 h-16 flex items-center justify-center mb-8 border border-primary/10 transition-colors">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black uppercase mb-6 leading-tight text-foreground">
                    {service.title}
                  </h2>
                  <p className="text-secondary text-lg mb-8 leading-relaxed">
                    {service.desc}
                  </p>
                  
                  {service.features.length > 0 && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                      {service.features.map((feature, j) => (
                        <li key={j} className="flex items-center space-x-3 rtl:space-x-reverse text-sm font-bold uppercase tracking-wider text-foreground/80">
                          <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href={`/${locale}/quote`}
                    className="inline-flex items-center text-accent font-black uppercase tracking-widest text-sm border-b-2 border-accent pb-2 group transition-all"
                  >
                    {t("requestQuote")}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-2" />
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA section */}
      <section className="py-24 bg-card industrial-grid border-t border-border transition-colors">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-4xl font-black uppercase mb-8 text-foreground">{t("ctaTitle")}</h2>
          <p className="text-secondary text-lg mb-12">
            {t("ctaDesc")}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="bg-primary text-primary-foreground px-12 py-5 font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all inline-block shadow-lg"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </section>
    </div>
  );
}
