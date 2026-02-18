"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealProps {
  children: React.ReactNode;
  /** Delay in seconds before animation starts */
  delay?: number;
  /** Duration in seconds (default: 1.0) */
  duration?: number;
  /** Viewport threshold (0 to 1) where animation triggers. 0.1 = 10% from bottom. */
  threshold?: number;
  /** Width of the wrapper */
  width?: "fit-content" | "100%";
  /** If true, animation plays only once. If false, it reverses on scroll up. */
  once?: boolean;
}

/**
 * Cinematic Scroll Reveal Wrapper
 * Wraps content in a div that animates into view (Slide Up + Fade + Blur)
 */
export default function Reveal({ 
  children, 
  delay = 0, 
  duration = 1.0, 
  threshold = 0.2, 
  width = "fit-content",
  once = false
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    gsap.fromTo(ref.current,
      {
        y: 40,
        opacity: 0,
        filter: "blur(12px)",
        willChange: "transform, opacity, filter"
      },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: duration,
        delay: delay,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: ref.current,
          start: `top ${100 - (threshold * 100)}%`, // e.g. "top 80%"
          toggleActions: once ? "play none none none" : "play none none reverse",
        },
        onComplete: () => {
          // Clean up GPU hint to save memory
          if (ref.current) {
            ref.current.style.willChange = "auto"; 
            ref.current.style.filter = "none"; // Fix blur artifacts
          }
        }
      }
    );
  }, { scope: ref });

  // Initial opacity 0 to prevent flash of unstyled content
  return (
    <div ref={ref} style={{ width, opacity: 0 }}>
      {children}
    </div>
  );
}
