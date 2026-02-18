"use client";

import { useRef, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import dynamic from "next/dynamic";
import SceneOptimizer from "@/components/performance/SceneOptimizer";

import { ACESFilmicToneMapping } from "three";
import type { Group } from "three";

import { useHeroScrollAnimations } from "@/hooks/useScrollAnimations";
import CinematicController from "@/components/visuals/CinematicController";

const Crankshaft = dynamic(() => import("@/components/visuals/Crankshaft"), { ssr: false });
const MachiningGrid = dynamic(() => import("@/components/visuals/MachiningGrid"), { ssr: false });

import { useTranslations, useLocale } from "next-intl";

function ResponsiveCrankshaftWrapper() {
  const { width } = useThree((state) => state.viewport);
  const isMobile = width < 5;

  return (
    <group 
      position={isMobile ? [0, -1.5, 0] : [2, -0.8, -1]} 
      scale={isMobile ? 0.7 : 0.9} 
      rotation={[0, -Math.PI / 6, Math.PI / 2.1]}
    >
      <Crankshaft />
    </group>
  );
}

export default function Hero({ settings }: { settings: any }) {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const siteName = settings.siteName || "MANA";
  
  // Reference to 3D object for scroll animation
  const objectRef = useRef<Group>(null);

  // ── Scroll-driven animations ────────────────────────────────────────────
  // containerRef: the hero section (scroll trigger boundary)
  // contentRef:   text layer — slides up + fades out
  // canvasRef:    3D background — subtle depth parallax (slower)
  // accentRef:    "01." overlay — fastest parallax + fade for depth
  const { containerRef, contentRef, canvasRef, accentRef } = useHeroScrollAnimations();

  // ── Initial reveal animation (runs once on mount) ───────────────────────
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.5 } });
    tl.from(".hero-line", { y: 100, opacity: 0, stagger: 0.2, force3D: true })
      .from(".hero-cta", { scale: 0.9, opacity: 0, force3D: true }, "-=1");
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[700px] w-full bg-background dark:bg-[#0a0c10] overflow-hidden flex items-center"
    >
      {/* 3D Background — depth parallax layer */}
      <div ref={canvasRef} className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0.5, 6], fov: 40 }}
          gl={{ 
            antialias: false, 
            powerPreference: "high-performance",
            alpha: true,
            stencil: false,
            depth: true,
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 1.0
          }}
          dpr={[1, 1]} // Fixed DPR for performance — no supersampling
        >
          {/* Cinematic industrial lighting rig */}
          <ambientLight intensity={0.2} />
          
          {/* Main Key Light */}
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={8}
            castShadow
            shadow-bias={-0.0001}
          />

          {/* Rim light */}
          <pointLight
            position={[-10, -10, -10]}
            intensity={5}
            color="#orange"
          />
          
          {/* Top-down Fill */}
          <directionalLight
            position={[0, 10, 0]}
            intensity={1}
            color="#b0c4de"
          />
          
          <Suspense fallback={null}>
            <SceneOptimizer>
              <CinematicController triggerRef={containerRef} objectRef={objectRef} />
              
              <group ref={objectRef}>
                <ResponsiveCrankshaftWrapper />
              </group>
              
              <ContactShadows 
                opacity={0.4} 
                scale={15} 
                blur={2.5} 
                far={4} 
                resolution={256} 
                color="#000000" 
                frames={1} 
              />
              
              <MachiningGrid />
            </SceneOptimizer>
          </Suspense>
        </Canvas>
      </div>

      {/* Content — slides up + fades on scroll */}
      <div ref={contentRef} className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl ltr:text-left rtl:text-right">
          <div className="overflow-hidden mb-4">
            <span className="hero-line block text-accent font-bold uppercase tracking-[0.3em] text-xs">
              {t("header") || "Industrial Excellence Since 1998"} 
            </span>
          </div>
          <div className="overflow-hidden mb-8">
            <h1 className="hero-line text-5xl md:text-8xl font-black text-foreground leading-none uppercase">
              {t("titlePart1")} <br />
              <span className="text-secondary/60">{t("titlePart2")}</span>
            </h1>
          </div>
          <div className="overflow-hidden mb-12">
            <p className="hero-line text-lg text-secondary max-w-xl leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
          <div className="hero-cta flex flex-wrap gap-4">
            <Link
              href={`/${locale}/contact`}
              className="bg-primary text-primary-foreground border-2 border-primary px-10 py-4 font-bold uppercase tracking-widest hover:bg-transparent hover:text-foreground transition-all flex items-center shadow-lg"
            >
              {t("cta")}
              <ChevronRight className="ml-2 w-5 h-5 rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/services`}
              className="border-2 border-primary/20 text-foreground px-10 py-4 font-bold uppercase tracking-widest hover:border-primary transition-all"
            >
              {t("expertise")}
            </Link>
          </div>
        </div>
      </div>

      {/* Industrial Accent — fastest parallax + fade for depth */}
      <div ref={accentRef} className="absolute right-0 bottom-0 p-12 hidden lg:block opacity-20 select-none">
        <div className="text-[120px] font-black text-foreground leading-none tracking-tighter">
          01.
        </div>
      </div>
    </section>
  );
}
