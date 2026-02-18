"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import gsap from "gsap";
import { useRouter, usePathname } from "next/navigation";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { useLocale } from "next-intl";

interface TransitionContextValue {
  /** Initiate a route change with an exit animation */
  initiate: (href: string) => void;
  /** Current state of the transition */
  stage: "entering" | "exiting" | "idle";
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within a TransitionProvider");
  }
  return context;
}

export default function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { lenis } = useSmoothScroll();
  const [stage, setStage] = useState<"entering" | "exiting" | "idle">("idle");
  
  // Ref to the overlay element (we'll query it by ID or pass it via context if we strictly composition it, 
  // but ID is simpler for a global singleton overlay)
  const overlayId = "page-transition-overlay";

  // ─── 2. Handle Enter Animation (on path change) ─────────────────────────────
  useEffect(() => {
    // When pathname changes, we are "entering" the new route
    setStage("entering");

    // Animation: Reveal content
    const ctx = gsap.context(() => {
      // Ensure we are at top
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
        lenis.start(); // Unlock scroll
      } else {
        window.scrollTo(0, 0);
      }

      // Animate Curtain Up/Out
      const tl = gsap.timeline({
        onComplete: () => {
          setStage("idle");
          // Clear any inline styles to prevent z-index issues
          gsap.set(`#${overlayId}`, { clearProps: "all" });
        }
      });

      tl.to(`#${overlayId}`, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        display: "none" // Hide after fade
      });
      
      // Optional: Stagger content reveal if we have a standard selector
      tl.from("main", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        clearProps: "all"
      }, "-=0.4");

    });

    return () => ctx.revert();
  }, [pathname, lenis]);

  // ─── 1. Handle Exit Animation (triggered by Link) ───────────────────────────
  const initiate = (href: string) => {
    if (stage !== "idle") return; // Prevent double clicks
    
    // Check if we are navigating to the same page
    if (href === pathname) return;

    setStage("exiting");
    
    // Lock Scroll
    if (lenis) lenis.stop();

    // Animate Curtain Down/In
    const ctx = gsap.context(() => {
      // Ensure overlay is display:block before animating opactiy
      gsap.set(`#${overlayId}`, { display: "block", opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          // Push route after curtain covers screen
          router.push(href);
        }
      });

      tl.to(`#${overlayId}`, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut"
      });
    });
  };

  return (
    <TransitionContext.Provider value={{ initiate, stage }}>
      {/* 
        The Overlay is rendered here so it persists across page updates 
        if this provider is in layout.tsx 
      */}
      <div 
        id={overlayId} 
        className="fixed inset-0 z-[9999] bg-background pointer-events-none hidden opacity-0"
        aria-hidden="true"
      />
      {children}
    </TransitionContext.Provider>
  );
}
