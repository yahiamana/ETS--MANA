"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScroll } from "@/components/SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

interface ScrollTimelineOptions {
  trigger?: React.RefObject<HTMLElement | null> | string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean | string | HTMLElement;
  markers?: boolean;
  onUpdate?: (self: ScrollTrigger) => void;
}

/**
 * Creates a GSAP Timeline that is perfectly synchronized with the scroll position.
 * Optimized for Lenis integration.
 *
 * @example
 * const { timeline, containerRef } = useScrollTimeline({
 *   start: "top bottom",
 *   end: "bottom top",
 *   scrub: 1
 * });
 *
 * useGSAP(() => {
 *   timeline.current
 *     .to(".element", { y: 0, opacity: 1 })
 *     .to(".other", { x: 100 });
 * }, { scope: containerRef });
 */
export function useScrollTimeline(options: ScrollTimelineOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    const triggerElement = options.trigger 
      ? (typeof options.trigger === "string" ? options.trigger : options.trigger.current) 
      : containerRef.current;

    if (!triggerElement) return;

    const ctx = gsap.context(() => {
      // Create the timeline tailored for scroll scrubbing
      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: options.start || "top bottom",
          end: options.end || "bottom top",
          scrub: options.scrub ?? true,
          pin: options.pin,
          markers: options.markers,
          onUpdate: (self) => {
            setProgress(self.progress);
            options.onUpdate?.(self);
          },
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      timelineRef.current = null;
    };
  }, [options.trigger, options.start, options.end, options.scrub, options.pin]);

  return { containerRef, timeline: timelineRef, progress };
}

/**
 * Accesses the live scroll velocity from Lenis for dynamic effects (skew, blur, etc.).
 * Returns a ref that contains the current velocity to avoid re-renders,
 * and a reactive state if specifically needed (use sparingly).
 */
export function useScrollVelocity() {
  const { lenis } = useSmoothScroll();
  const velocityRef = useRef(0);
  
  // We use a ref for the subscriber to avoid stale closures in the effect
  useEffect(() => {
    if (!lenis) return;

    const update = (e: any) => {
      velocityRef.current = e.velocity;
    };

    lenis.on("scroll", update);

    return () => {
      lenis.off("scroll", update);
    };
  }, [lenis]);

  return velocityRef;
}
