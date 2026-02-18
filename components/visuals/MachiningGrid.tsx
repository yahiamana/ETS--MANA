"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { LineSegments, BufferGeometry, Float32BufferAttribute } from "three";

export default function MachiningGrid() {
  const gridRef = useRef<LineSegments>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (gridRef.current) {
      gridRef.current.position.z = (time * 0.2) % 2;
      if (gridRef.current.material) {
        (gridRef.current.material as any).opacity = 0.05 + Math.sin(time) * 0.02;
      }
    }
  });

  // Create a custom grid of lines - Optimized vertex count and memoized
  const geometry = useMemo(() => {
    const size = 20;
    const divisions = 12;
    const geo = new BufferGeometry();
    const vertices = [];

    for (let i = -size / 2; i <= size / 2; i += size / divisions) {
      vertices.push(-size / 2, 0, i, size / 2, 0, i);
      vertices.push(i, 0, -size / 2, i, 0, size / 2);
    }

    geo.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    return geo;
  }, []);

  return (
    <lineSegments ref={gridRef} geometry={geometry}>
      <lineBasicMaterial color="#7C858A" transparent opacity={0.1} />
    </lineSegments>
  );
}
