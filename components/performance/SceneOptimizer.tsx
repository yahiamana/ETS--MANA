import { useThree, useFrame } from "@react-three/fiber";
import { useState, useRef, useEffect, ReactNode } from "react";
import { Group } from "three";

interface SceneOptimizerProps {
  children: ReactNode;
}

export default function SceneOptimizer({ children }: SceneOptimizerProps) {
  const { gl, set, advance } = useThree();
  const [isVisible, setIsVisible] = useState(true);
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 } // Trigger as soon as 1px is visible/hidden
    );

    const canvas = gl.domElement;
    if (canvas) observer.observe(canvas);

    return () => {
      if (canvas) observer.unobserve(canvas);
    };
  }, [gl]);

  return (
    <group ref={groupRef} visible={isVisible}>
      {children}
    </group>
  );
}

/**
 * Hook to check visibility state - useful for pausing logic
 */
export function useVisibility() {
  const { gl } = useThree();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(gl.domElement);
    return () => observer.disconnect();
  }, [gl]);

  return isVisible;
}
