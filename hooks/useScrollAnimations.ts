"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ───────────────────────────────────────────────────────────────────

interface ScrollProgressOptions {
  /** ScrollTrigger start position (default: "top bottom") */
  start?: string;
  /** ScrollTrigger end position (default: "bottom top") */
  end?: string;
  /** Whether to scrub animations (default: true) */
  scrub?: boolean | number;
}

interface ScrollProgressResult {
  /** Ref to attach to the target element */
  ref: React.RefObject<HTMLElement | null>;
  /** Current scroll progress 0 → 1 for the element's viewport traversal */
  progress: number;
}

// ─── useScrollProgress ───────────────────────────────────────────────────────

/**
 * Returns a normalized 0→1 progress value as an element scrolls through the viewport.
 * Uses GSAP ScrollTrigger under the hood so it stays synced with Lenis.
 *
 * @example
 * const { ref, progress } = useScrollProgress({ start: "top bottom", end: "bottom top" });
 * // progress goes 0 → 1 as element enters and leaves viewport
 */
export function useScrollProgress(
  options: ScrollProgressOptions = {}
): ScrollProgressResult {
  const { start = "top bottom", end = "bottom top", scrub = true } = options;
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start,
      end,
      scrub: scrub === true ? 0.5 : scrub,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [start, end, scrub]);

  return { ref, progress };
}

// ─── useScrollParallax ───────────────────────────────────────────────────────

interface ParallaxConfig {
  /** Y-axis translation range in px (default: 100) — element moves this many px over full scroll */
  yRange?: number;
  /** Scale range [start, end] (default: [1, 1]) */
  scaleRange?: [number, number];
  /** Opacity range [start, end] (default: [1, 1]) */
  opacityRange?: [number, number];
  /** ScrollTrigger start (default: "top bottom") */
  start?: string;
  /** ScrollTrigger end (default: "bottom top") */
  end?: string;
  /** Scrub smoothness (default: 0.6) — higher = smoother but more latent */
  scrub?: number;
}

/**
 * Applies GPU-friendly scroll-driven parallax transforms to an element.
 * Uses GSAP ScrollTrigger + transform3d for composited-only animations.
 *
 * @example
 * const parallaxRef = useScrollParallax({ yRange: -80, opacityRange: [1, 0] });
 * <div ref={parallaxRef}>...</div>
 */
export function useScrollParallax(config: ParallaxConfig = {}) {
  const {
    yRange = 100,
    scaleRange = [1, 1],
    opacityRange = [1, 1],
    start = "top bottom",
    end = "bottom top",
    scrub = 0.6,
  } = config;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Set will-change for compositor hint, remove after animation
    ref.current.style.willChange = "transform, opacity";

    const tween = gsap.fromTo(
      ref.current,
      {
        y: 0,
        scale: scaleRange[0],
        opacity: opacityRange[0],
      },
      {
        y: yRange,
        scale: scaleRange[1],
        opacity: opacityRange[1],
        ease: "none", // Linear interpolation — scroll position *is* the easing
        scrollTrigger: {
          trigger: ref.current,
          start,
          end,
          scrub,
        },
      }
    );

    return () => {
      tween.kill();
      if (ref.current) {
        ref.current.style.willChange = "auto";
      }
    };
  }, [yRange, scaleRange, opacityRange, start, end, scrub]);

  return ref;
}

// ─── useHeroScrollAnimations ─────────────────────────────────────────────────

interface HeroScrollResult {
  /** Ref for the hero container section */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Ref for the text content layer */
  contentRef: React.RefObject<HTMLDivElement | null>;
  /** Ref for the 3D canvas background layer */
  canvasRef: React.RefObject<HTMLDivElement | null>;
  /** Ref for the accent overlay (e.g. "01.") */
  accentRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Applies cinematic scroll-driven animations to the hero section.
 * All transforms are GPU-composited (translate3d, scale3d, opacity).
 *
 * Effects:
 * - Content: slides up + fades out as user scrolls past hero
 * - Canvas: subtle parallax depth shift (slower than content)
 * - Accent: faster parallax + fade for depth layering
 */
export function useHeroScrollAnimations(): HeroScrollResult {
  const containerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const accentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const trigger = {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      };

      // ── Content layer: slides up + fades out ──────────────────────────
      if (contentRef.current) {
        contentRef.current.style.willChange = "transform, opacity";
        gsap.to(contentRef.current, {
          y: -120,
          opacity: 0,
          ease: "none",
          scrollTrigger: trigger,
        });
      }

      // ── Canvas layer: subtle depth parallax (moves slower) ────────────
      if (canvasRef.current) {
        canvasRef.current.style.willChange = "transform";
        gsap.to(canvasRef.current, {
          y: 60,
          scale: 1.05,
          ease: "none",
          scrollTrigger: trigger,
        });
      }

      // ── Accent layer: faster parallax + fade for depth ────────────────
      if (accentRef.current) {
        accentRef.current.style.willChange = "transform, opacity";
        gsap.to(accentRef.current, {
          y: -200,
          opacity: 0,
          ease: "none",
          scrollTrigger: trigger,
        });
      }
    }, containerRef);

    return () => {
      ctx.revert(); // Kills all ScrollTriggers + restores inline styles
      // Clean up will-change hints
      [contentRef, canvasRef, accentRef].forEach((r) => {
        if (r.current) r.current.style.willChange = "auto";
      });
    };
  }, []);

  return { containerRef, contentRef, canvasRef, accentRef };
}
