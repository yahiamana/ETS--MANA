"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { useLayoutEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Group } from "three";

gsap.registerPlugin(ScrollTrigger);

interface CinematicControllerProps {
  /** The DOM element that drives the scroll timeline (the Hero section) */
  triggerRef: RefObject<HTMLElement | null>;
  /** The 3D object to animate (the Crankshaft group) */
  objectRef: RefObject<Group | null>;
}

export default function CinematicController({ triggerRef, objectRef }: CinematicControllerProps) {
  const { camera, gl } = useThree();

  useLayoutEffect(() => {
    if (!triggerRef.current) return;

    // Ensure the timeline updates in sync with Three.js render loop
    // But GSAP ScrollTrigger handles scrub automatically
    
    // Initial Camera State (matches Hero.tsx default: [0, 0.5, 6])
    camera.position.set(0, 0.5, 6);
    camera.rotation.set(0, 0, 0);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5, // 1.5s smoothing for heavy cinematic feel
      }
    });

    // ── Camera Moves ─────────────────────────────────────────────────────────
    // 1. Move camera down and closer (technical inspection view)
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 3.5,
      ease: "power2.inOut",
    }, 0);

    // 2. Rotate camera slightly to look up at the machinery
    tl.to(camera.rotation, {
      x: 0.1, // Slight tilt up
      ease: "power2.inOut",
    }, 0);

    // ── Object Moves ─────────────────────────────────────────────────────────
    // Rotate the crankshaft group as we scroll
    if (objectRef.current) {
      // Start rotation
      tl.to(objectRef.current.rotation, {
        y: Math.PI * 0.5, // Rotate 90 degrees
        x: 0.2, // Slight tilt
        ease: "none", // Linear rotation with scroll
      }, 0);

      // Move object slightly up to stay centered as camera moves down
      tl.to(objectRef.current.position, {
        y: 0.5,
        ease: "power2.inOut",
      }, 0);
    }

    return () => {
      tl.kill();
    };
  }, [triggerRef, objectRef, camera]);

  return null; // Logic only component
}
