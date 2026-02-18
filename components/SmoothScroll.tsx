"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SmoothScrollContextValue {
  /** The underlying Lenis instance (null during SSR / before init) */
  lenis: Lenis | null;
  /** Programmatic scroll-to: accepts px offset, CSS selector, or HTMLElement */
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number; duration?: number; immediate?: boolean }
  ) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
});

/**
 * Hook for consumers to access the Lenis scroll controller.
 *
 * @example
 * const { scrollTo } = useSmoothScroll();
 * scrollTo("#contact", { offset: -80 });
 */
export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

// ─── Configuration ───────────────────────────────────────────────────────────

/** Cinematic exponential ease-out — fast attack, smooth deceleration */
const EASE = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

const LENIS_CONFIG = {
  duration: 1.5, // Slightly longer for more "luxurious" feel
  easing: EASE,
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  smoothWheel: true,
  wheelMultiplier: 1.1, // Subtle boost to scrolling speed
  touchMultiplier: 1.2, // Lowered for more precise touch control
  infinite: false,
  autoResize: true,
  lerp: 0.1, // Explicit linear interpolation for smoothness
};

/** Detect if the user prefers reduced motion */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [contextValue, setContextValue] = useState<SmoothScrollContextValue>({
    lenis: null,
    scrollTo: () => {},
  });

  useLayoutEffect(() => {
    // ── 0. Register GSAP plugins ──────────────────────────────────────────
    gsap.registerPlugin(ScrollTrigger);

    // ── 1. Decide whether to enable smooth scroll ─────────────────────────
    const reducedMotion = prefersReducedMotion();
    // Enable on all devices for consistent physics
    const shouldSmooth = !reducedMotion;

    if (!shouldSmooth) {
      // Expose a no-op context so consumers don't break
      setContextValue({
        lenis: null,
        scrollTo: (target, opts) => {
          if (typeof target === "number") {
            window.scrollTo({ top: target, behavior: "auto" });
          } else if (typeof target === "string") {
            document.querySelector(target)?.scrollIntoView({ behavior: "auto" });
          } else if (target instanceof HTMLElement) {
            target.scrollIntoView({ behavior: "auto" });
          }
        },
      });
      // Still refresh ScrollTrigger for GSAP animations
      ScrollTrigger.refresh();
      return;
    }

    // ── 2. Create Lenis instance ──────────────────────────────────────────
    const lenis = new Lenis(LENIS_CONFIG);
    lenisRef.current = lenis;

    // ── 3. Bidirectional GSAP ↔ Lenis sync ────────────────────────────────

    // 3a. Forward Lenis scroll events into ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // 3b. Drive Lenis from GSAP's unified ticker (single RAF, no duplicates)
    const onTick = (time: number) => {
      lenis.raf(time * 1000); // GSAP gives seconds, Lenis expects ms
    };
    gsap.ticker.add(onTick);

    // Disable GSAP's lag smoothing to keep scroll tightly synced
    gsap.ticker.lagSmoothing(0);

    // ── 4. Resize handling ────────────────────────────────────────────────
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Recalculate scroll dimensions after layout settles
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ── 5. Reduced‑motion media query change (live) ───────────────────────
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
    motionQuery.addEventListener("change", onMotionChange);

    // ── 6. Expose context ─────────────────────────────────────────────────
    setContextValue({
      lenis,
      scrollTo: (target, opts) => {
        lenis.scrollTo(target as any, {
          offset: opts?.offset ?? 0,
          duration: opts?.duration ?? 1.2,
          immediate: opts?.immediate ?? false,
        });
      },
    });

    // ── 7. Initial ScrollTrigger refresh after Lenis is ready ─────────────
    // Small delay lets Lenis measure the page before ST calculates positions
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    // ── 8. Cleanup ────────────────────────────────────────────────────────
    return () => {
      gsap.ticker.remove(onTick);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;

      window.removeEventListener("resize", onResize);
      motionQuery.removeEventListener("change", onMotionChange);
      clearTimeout(resizeTimer);

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
