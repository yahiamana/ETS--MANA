"use client";

import {
  createContext,
  useContext,
  useRef,
  useLayoutEffect,
  ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Context ─────────────────────────────────────────────────────────────────

interface ParallaxContextValue {
  containerRef: React.RefObject<HTMLElement | null>;
  masterTimeline: React.MutableRefObject<gsap.core.Timeline | null>;
}

const ParallaxContext = createContext<ParallaxContextValue | null>(null);

// ─── ParallaxContainer ───────────────────────────────────────────────────────

interface ParallaxContainerProps {
  children: ReactNode;
  start?: string;
  end?: string;
  className?: string;
  scrub?: boolean | number;
}

/**
 * Creates a scroll-linked timeline context for parallax layers.
 * The container defines the scroll distance over which child layers animate.
 */
export function ParallaxContainer({
  children,
  start = "top bottom",
  end = "bottom top",
  className = "relative overflow-hidden",
  scrub = true,
}: ParallaxContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const masterTimeline = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initialize a master timeline linked to the container's scroll progress
      // Layers will add strictly synchronized tweens to this or a parallel timeline
      // But actually, for flexibility, layers usually create their own tweens
      // governed by the same ScrollTrigger logic. 
      // To ensure perfect sync, we can use a shared ScrollTrigger configuration.
      
      // However, managing a single shared timeline for dynamic children is complex in React.
      // A robust approach is to let each Layer create its own Tween linked to the container's trigger.
      // We'll expose the container ref so layers can use it as the trigger.
    }, containerRef);

    return () => ctx.revert();
  }, [start, end, scrub]);

  return (
    <ParallaxContext.Provider value={{ containerRef, masterTimeline }}>
      <div ref={containerRef} className={className}>
        {children}
      </div>
    </ParallaxContext.Provider>
  );
}

// ─── ParallaxLayer ───────────────────────────────────────────────────────────

interface ParallaxLayerProps {
  children: ReactNode;
  /** 
   * Speed multiplier relative to scroll.
   * 1 = Normal scroll (no parallax relative to page)
   * 0 = Fixed position (sticky)
   * < 1 = Slower (Background / Far depth)
   * > 1 = Faster (Foreground / Near depth)
   */
  speed?: number;
  className?: string;
  /** Optional separate range for Z-axis scaling to simulate depth */
  depthScale?: boolean;
}

/**
 * A layer within a ParallaxContainer that moves at a distinct speed.
 * Uses GPU transforms (translate3d) for smooth motion.
 */
export function ParallaxLayer({
  children,
  speed = 0.5,
  className = "",
  depthScale = false,
}: ParallaxLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const context = useContext(ParallaxContext);

  if (!context) {
    throw new Error("ParallaxLayer must be used within a ParallaxContainer");
  }

  useLayoutEffect(() => {
    const container = context.containerRef.current;
    if (!container || !layerRef.current) return;

    const ctx = gsap.context(() => {
      // Logic:
      // speed 1.0 = moves exactly with scroll (normal static element behavior in flow)
      // speed 0.5 = moves at 50% speed relative to viewport -> looks like background
      // speed 1.5 = moves at 150% speed relative to viewport -> looks like foreground
      
      // Implementation:
      // We are essentially counter-animating the element's position.
      // If speed is 0.5, we want it to lag behind.
      // Displacement = (1 - speed) * ScrollDistance
      
      const movementRange = 200; // Customizable or derived from container height if needed
      const yOffset = movementRange * (1 - speed);

      gsap.fromTo(layerRef.current, 
        { y: yOffset },
        {
          y: -yOffset,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        }
      );
    }, context.containerRef);

    return () => ctx.revert();
  }, [speed, depthScale, context.containerRef]);

  return (
    <div ref={layerRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
