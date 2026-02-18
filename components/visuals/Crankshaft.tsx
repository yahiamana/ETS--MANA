"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Group,
  MathUtils,
  CylinderGeometry,
  LatheGeometry,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  Vector2,
  BufferGeometry,
  Float32BufferAttribute,
  Color,
} from "three";
import { useVisibility } from "@/components/performance/SceneOptimizer";

// ─── Engineering Constants ───────────────────────────────────────────
// Based on a typical 4-cylinder inline tractor crankshaft.
// Throw angle pattern: 0° - 180° - 180° - 0° (flat-plane firing order)

const MAIN_JOURNAL_RADIUS = 0.38;
const MAIN_JOURNAL_LENGTH = 0.42;
const ROD_JOURNAL_RADIUS = 0.32;
const ROD_JOURNAL_LENGTH = 0.48;
const THROW_OFFSET = 0.52; // crank throw radius (center-to-center)
const WEB_THICKNESS = 0.18;
const WEB_WIDTH = 0.92;
const WEB_HEIGHT = 1.1;
const CW_OUTER_RADIUS = 0.82;
const CW_INNER_RADIUS = 0.2;
const CW_THICKNESS = 0.16;
const FILLET_RADIUS = 0.04;
const OIL_HOLE_RADIUS = 0.045;
const OIL_HOLE_DEPTH = 0.22;
const TOTAL_THROWS = 4;
const TOTAL_MAINS = 5;

// Journal spacing along crankshaft axis
const JOURNAL_SPACING = 1.22;
const HALF_LENGTH = ((TOTAL_MAINS - 1) * JOURNAL_SPACING) / 2;

// Throw angles for 4-cylinder inline (degrees)
const THROW_ANGLES = [0, Math.PI, Math.PI, 0];

// ─── Geometry Builders ───────────────────────────────────────────────

/**
 * Creates a journal cylinder with fillet rings at each end.
 * Uses LatheGeometry for smoother profile with integrated fillets.
 */
function createJournalGeometry(
  radius: number,
  length: number,
  segments: number,
  filletR: number
): BufferGeometry {
  const halfLen = length / 2;
  const steps = 5;
  const points: Vector2[] = [];

  // Bottom fillet curve
  for (let i = 0; i <= steps; i++) {
    const angle = (Math.PI / 2) * (i / steps);
    const x = radius - filletR + Math.cos(angle) * filletR;
    const y = -halfLen + filletR - Math.sin(angle) * filletR;
    points.push(new Vector2(x, y));
  }

  // Straight barrel
  points.push(new Vector2(radius, -halfLen + filletR));
  points.push(new Vector2(radius, halfLen - filletR));

  // Top fillet curve
  for (let i = 0; i <= steps; i++) {
    const angle = (Math.PI / 2) * (1 - i / steps);
    const x = radius - filletR + Math.cos(angle) * filletR;
    const y = halfLen - filletR + Math.sin(angle) * filletR;
    points.push(new Vector2(x, y));
  }

  return new LatheGeometry(points, segments);
}

/**
 * Creates a counterweight with a realistic semi-circular profile.
 * Built as a lathe sector (not full revolution) for proper mass shape.
 */
function createCounterweightGeometry(
  outerR: number,
  innerR: number,
  thickness: number,
  segments: number
): BufferGeometry {
  const halfThick = thickness / 2;

  // Profile points from inner to outer radius
  const points: Vector2[] = [];
  points.push(new Vector2(innerR, -halfThick));
  points.push(new Vector2(outerR * 0.95, -halfThick));
  points.push(new Vector2(outerR, -halfThick * 0.7));
  points.push(new Vector2(outerR, halfThick * 0.7));
  points.push(new Vector2(outerR * 0.95, halfThick));
  points.push(new Vector2(innerR, halfThick));

  // Lathe only 180° for the counterweight sector
  return new LatheGeometry(points, segments, 0, Math.PI);
}

/**
 * Creates a crank web profile — the structural arm connecting main journal
 * to rod journal. Uses a tapered rectangular cross-section with chamfered edges.
 */
function createWebGeometry(
  width: number,
  height: number,
  thickness: number,
  segments: number
): BufferGeometry {
  // Build as a box-like shape from vertices for chamfered edges
  const hw = width / 2;
  const hh = height / 2;
  const ht = thickness / 2;
  const chamfer = 0.03;

  const geo = new CylinderGeometry(1, 1, 1, 4, 1);

  // Actually, for a cleaner look, build a scaled box from a cylinder with 4 sides
  // But for proper chamfer, let's use a simple geometry approach:
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  // Front face
  addQuad(positions, normals, indices,
    [-hw + chamfer, -hh + chamfer, ht],
    [hw - chamfer, -hh + chamfer, ht],
    [hw - chamfer, hh - chamfer, ht],
    [-hw + chamfer, hh - chamfer, ht],
    [0, 0, 1]
  );

  // Back face
  addQuad(positions, normals, indices,
    [hw - chamfer, -hh + chamfer, -ht],
    [-hw + chamfer, -hh + chamfer, -ht],
    [-hw + chamfer, hh - chamfer, -ht],
    [hw - chamfer, hh - chamfer, -ht],
    [0, 0, -1]
  );

  // Right face
  addQuad(positions, normals, indices,
    [hw, -hh + chamfer, ht - chamfer],
    [hw, -hh + chamfer, -ht + chamfer],
    [hw, hh - chamfer, -ht + chamfer],
    [hw, hh - chamfer, ht - chamfer],
    [1, 0, 0]
  );

  // Left face
  addQuad(positions, normals, indices,
    [-hw, -hh + chamfer, -ht + chamfer],
    [-hw, -hh + chamfer, ht - chamfer],
    [-hw, hh - chamfer, ht - chamfer],
    [-hw, hh - chamfer, -ht + chamfer],
    [-1, 0, 0]
  );

  // Top face
  addQuad(positions, normals, indices,
    [-hw + chamfer, hh, ht - chamfer],
    [hw - chamfer, hh, ht - chamfer],
    [hw - chamfer, hh, -ht + chamfer],
    [-hw + chamfer, hh, -ht + chamfer],
    [0, 1, 0]
  );

  // Bottom face
  addQuad(positions, normals, indices,
    [-hw + chamfer, -hh, -ht + chamfer],
    [hw - chamfer, -hh, -ht + chamfer],
    [hw - chamfer, -hh, ht - chamfer],
    [-hw + chamfer, -hh, ht - chamfer],
    [0, -1, 0]
  );

  // Chamfer strips (12 edge chamfers)
  // Top-front chamfer
  addQuad(positions, normals, indices,
    [-hw + chamfer, hh - chamfer, ht], [hw - chamfer, hh - chamfer, ht],
    [hw - chamfer, hh, ht - chamfer], [-hw + chamfer, hh, ht - chamfer],
    [0, 0.707, 0.707]
  );
  // Bottom-front chamfer
  addQuad(positions, normals, indices,
    [-hw + chamfer, -hh, ht - chamfer], [hw - chamfer, -hh, ht - chamfer],
    [hw - chamfer, -hh + chamfer, ht], [-hw + chamfer, -hh + chamfer, ht],
    [0, -0.707, 0.707]
  );
  // Top-back chamfer
  addQuad(positions, normals, indices,
    [hw - chamfer, hh - chamfer, -ht], [-hw + chamfer, hh - chamfer, -ht],
    [-hw + chamfer, hh, -ht + chamfer], [hw - chamfer, hh, -ht + chamfer],
    [0, 0.707, -0.707]
  );
  // Bottom-back chamfer
  addQuad(positions, normals, indices,
    [hw - chamfer, -hh, -ht + chamfer], [-hw + chamfer, -hh, -ht + chamfer],
    [-hw + chamfer, -hh + chamfer, -ht], [hw - chamfer, -hh + chamfer, -ht],
    [0, -0.707, -0.707]
  );
  // Right-front chamfer
  addQuad(positions, normals, indices,
    [hw - chamfer, -hh + chamfer, ht], [hw, -hh + chamfer, ht - chamfer],
    [hw, hh - chamfer, ht - chamfer], [hw - chamfer, hh - chamfer, ht],
    [0.707, 0, 0.707]
  );
  // Right-back chamfer
  addQuad(positions, normals, indices,
    [hw, -hh + chamfer, -ht + chamfer], [hw - chamfer, -hh + chamfer, -ht],
    [hw - chamfer, hh - chamfer, -ht], [hw, hh - chamfer, -ht + chamfer],
    [0.707, 0, -0.707]
  );
  // Left-front chamfer
  addQuad(positions, normals, indices,
    [-hw, -hh + chamfer, ht - chamfer], [-hw + chamfer, -hh + chamfer, ht],
    [-hw + chamfer, hh - chamfer, ht], [-hw, hh - chamfer, ht - chamfer],
    [-0.707, 0, 0.707]
  );
  // Left-back chamfer
  addQuad(positions, normals, indices,
    [-hw + chamfer, -hh + chamfer, -ht], [-hw, -hh + chamfer, -ht + chamfer],
    [-hw, hh - chamfer, -ht + chamfer], [-hw + chamfer, hh - chamfer, -ht],
    [-0.707, 0, -0.707]
  );

  const bufGeo = new BufferGeometry();
  bufGeo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  bufGeo.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  bufGeo.setIndex(indices);
  bufGeo.computeVertexNormals();
  return bufGeo;
}

function addQuad(
  positions: number[], normals: number[], indices: number[],
  a: number[], b: number[], c: number[], d: number[],
  n: number[]
) {
  const idx = positions.length / 3;
  positions.push(...a, ...b, ...c, ...d);
  normals.push(...n, ...n, ...n, ...n);
  indices.push(idx, idx + 1, idx + 2, idx, idx + 2, idx + 3);
}

// ─── LOD Helpers ─────────────────────────────────────────────────────

function getSegmentCounts(isLowEnd: boolean) {
  return {
    journalSegs: isLowEnd ? 16 : 32,
    counterweightSegs: isLowEnd ? 10 : 20,
    flangeSegs: isLowEnd ? 16 : 32,
    oilHoleSegs: isLowEnd ? 6 : 12,
    boltSegs: isLowEnd ? 4 : 8,
    webDetail: isLowEnd ? 1 : 1,
  };
}

// ─── Component ───────────────────────────────────────────────────────

export default function Crankshaft() {
  const groupRef = useRef<Group>(null!);
  const crankshaftRef = useRef<Group>(null!);
  const { gl, mouse, viewport } = useThree();
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Optimization: specific visibility hook
  const isVisible = useVisibility();

  // Detect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // GPU capability detection for LOD
  const isLowEnd = useMemo(() => {
    const isMobile = viewport.width < 6; // ~768px at default camera
    const maxTex = gl.capabilities.maxTextureSize;
    return isMobile || maxTex <= 4096;
  }, [gl, viewport.width]);

  const segs = useMemo(() => getSegmentCounts(isLowEnd), [isLowEnd]);

  // ── Pre-built Geometries (memoized, GPU-ready) ──────────────────
  const geometries = useMemo(() => {
    const mainJournal = createJournalGeometry(
      MAIN_JOURNAL_RADIUS, MAIN_JOURNAL_LENGTH, segs.journalSegs, FILLET_RADIUS
    );
    const rodJournal = createJournalGeometry(
      ROD_JOURNAL_RADIUS, ROD_JOURNAL_LENGTH, segs.journalSegs, FILLET_RADIUS
    );
    const counterweight = createCounterweightGeometry(
      CW_OUTER_RADIUS, CW_INNER_RADIUS, CW_THICKNESS, segs.counterweightSegs
    );
    const web = createWebGeometry(WEB_WIDTH * 0.5, WEB_HEIGHT, WEB_THICKNESS, segs.webDetail);
    const oilHole = new CylinderGeometry(
      OIL_HOLE_RADIUS, OIL_HOLE_RADIUS, OIL_HOLE_DEPTH, segs.oilHoleSegs
    );
    const frontSnout = createJournalGeometry(
      MAIN_JOURNAL_RADIUS * 0.75, 0.6, segs.journalSegs, 0.02
    );
    const keyway = createWebGeometry(0.06, 0.08, 0.62, 1);
    const rearFlange = new CylinderGeometry(
      MAIN_JOURNAL_RADIUS * 1.8, MAIN_JOURNAL_RADIUS * 1.8, 0.12, segs.flangeSegs
    );
    const flangeHub = new CylinderGeometry(
      MAIN_JOURNAL_RADIUS * 1.2, MAIN_JOURNAL_RADIUS * 1.2, 0.18, segs.flangeSegs
    );
    const boltHead = new CylinderGeometry(0.05, 0.05, 0.06, segs.boltSegs);
    const boltHole = new CylinderGeometry(0.04, 0.04, 0.14, segs.boltSegs);

    return {
      mainJournal, rodJournal, counterweight, web, oilHole,
      frontSnout, keyway, rearFlange, flangeHub, boltHead, boltHole,
    };
  }, [segs]);

  // ── PBR Materials ───────────────────────────────────────────────
  const materials = useMemo(() => {
    // Machined journal surfaces — ground steel with oil film (clearcoat)
    const machined = new MeshPhysicalMaterial({
      color: new Color("#A4B5C6"), // Slightly cooler/brighter steel
      metalness: 1.0,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 2.5,
    });

    // Forged steel — main body, heavy industrial look
    const forged = new MeshStandardMaterial({
      color: new Color("#5A626C"),
      metalness: 0.8,
      roughness: 0.45,
      envMapIntensity: 1.5,
    });

    // Cast counterweight — rough, dark, textured appearance
    const cast = new MeshStandardMaterial({
      color: new Color("#3A3F45"),
      metalness: 0.6,
      roughness: 0.7, // Very rough
      envMapIntensity: 1.0,
    });

    // Oil passage hole interior
    const oilPassage = new MeshStandardMaterial({
      color: new Color("#111111"),
      metalness: 0.2,
      roughness: 1.0,
    });

    // Bolt material — Black oxide finish
    const bolt = new MeshPhysicalMaterial({
      color: new Color("#1A1A1A"),
      metalness: 0.8,
      roughness: 0.3,
      clearcoat: 0.5,
      envMapIntensity: 2.0,
    });

    // Keyway — dark machined slot
    const keyway = new MeshStandardMaterial({
      color: new Color("#22262A"),
      metalness: 0.85,
      roughness: 0.4,
    });

    return { machined, forged, cast, oilPassage, bolt, keyway };
  }, []);

  // ── Animation Loop ──────────────────────────────────────────────
  useFrame((state) => {
    // Optimization: Skip frame logic if not visible
    if (!isVisible) return; 

    const time = state.clock.getElapsedTime();

    if (crankshaftRef.current) {
      if (!reducedMotion) {
        // Spin around the LONG axis (X-axis) to simulate engine running
        crankshaftRef.current.rotation.x = time * 0.2; 

        // Subtle floating/vibration on Y
        crankshaftRef.current.position.y = Math.sin(time * 0.5) * 0.05;
      }
    }

    if (groupRef.current) {
      // Mouse-driven parallax
      const targetX = mouse.x * 0.2;
      const targetY = mouse.y * 0.15;
      groupRef.current.position.x = MathUtils.lerp(groupRef.current.position.x, targetX, 0.015);
      groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, targetY, 0.015);
      
      // Gentle sway
      groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.1, 0.015);
    }
  });

  // ── Scene Assembly ──────────────────────────────────────────────
  
  const mainJournalPositions = Array.from({ length: TOTAL_MAINS }, (_, i) => (
    -HALF_LENGTH + i * JOURNAL_SPACING
  ));

  const rodJournalData = THROW_ANGLES.map((angle, i) => ({
    axialPos: -HALF_LENGTH + (i + 0.5) * JOURNAL_SPACING,
    throwAngle: angle,
    yOffset: Math.cos(angle) * THROW_OFFSET,
    zOffset: Math.sin(angle) * THROW_OFFSET,
  }));

  return (
    <group ref={groupRef}>
      {/* Removed static rotation here to allow parent to control orientation fully */}
      <group ref={crankshaftRef}>

        {/* ── Main Journals ────────────────────────────────────── */}
        {mainJournalPositions.map((x, i) => (
          <group key={`main-${i}`} position={[x, 0, 0]}>
            <mesh
              rotation={[0, 0, Math.PI / 2]}
              geometry={geometries.mainJournal}
              material={materials.machined}
            />
            {/* Oil passage holes on each main journal */}
            {!isLowEnd && (
              <mesh
                position={[0, MAIN_JOURNAL_RADIUS * 0.6, 0]}
                rotation={[0, 0, 0]}
                geometry={geometries.oilHole}
                material={materials.oilPassage}
              />
            )}
          </group>
        ))}

        {/* ── Rod Journals + Webs + Counterweights ─────────────── */}
        {rodJournalData.map((rod, i) => (
          <group key={`throw-${i}`}>
            {/* Rod journal — offset from center by throw radius */}
            <group position={[rod.axialPos, rod.yOffset, rod.zOffset]}>
              <mesh
                rotation={[0, 0, Math.PI / 2]}
                geometry={geometries.rodJournal}
                material={materials.machined}
              />
              {/* Oil hole on rod journal */}
              {!isLowEnd && (
                <mesh
                  position={[0, ROD_JOURNAL_RADIUS * 0.5, 0]}
                  geometry={geometries.oilHole}
                  material={materials.oilPassage}
                />
              )}
            </group>

            {/* Crank webs — two arms connecting main to rod journal */}
            {/* Left web (toward main journal i) */}
            <group
              position={[
                rod.axialPos - ROD_JOURNAL_LENGTH * 0.42,
                rod.yOffset * 0.5,
                rod.zOffset * 0.5,
              ]}
              rotation={[0, 0, rod.throwAngle]}
            >
              <mesh
                geometry={geometries.web}
                material={materials.forged}
                scale={[1, 1, 1]}
              />
            </group>

            {/* Right web (toward main journal i+1) */}
            <group
              position={[
                rod.axialPos + ROD_JOURNAL_LENGTH * 0.42,
                rod.yOffset * 0.5,
                rod.zOffset * 0.5,
              ]}
              rotation={[0, 0, rod.throwAngle]}
            >
              <mesh
                geometry={geometries.web}
                material={materials.forged}
              />
            </group>

            {/* Counterweight — opposite side of throw for balance */}
            <group
              position={[
                rod.axialPos,
                -rod.yOffset * 0.6,
                -rod.zOffset * 0.6,
              ]}
              rotation={[
                Math.PI / 2,
                0,
                rod.throwAngle + Math.PI,
              ]}
            >
              <mesh
                geometry={geometries.counterweight}
                material={materials.cast}
              />
            </group>
          </group>
        ))}

        {/* ── Front Snout + Keyway ─────────────────────────────── */}
        <group position={[-HALF_LENGTH - JOURNAL_SPACING * 0.55, 0, 0]}>
          <mesh
            rotation={[0, 0, Math.PI / 2]}
            geometry={geometries.frontSnout}
            material={materials.machined}
          />
          {/* Keyway slot on snout */}
          <mesh
            position={[0, MAIN_JOURNAL_RADIUS * 0.65, 0]}
            geometry={geometries.keyway}
            material={materials.keyway}
          />
        </group>

        {/* ── Rear Flange Assembly ─────────────────────────────── */}
        <group position={[HALF_LENGTH + JOURNAL_SPACING * 0.45, 0, 0]}>
          {/* Flange disc */}
          <mesh
            rotation={[0, 0, Math.PI / 2]}
            geometry={geometries.rearFlange}
            material={materials.forged}
          />
          {/* Hub */}
          <mesh
            rotation={[0, 0, Math.PI / 2]}
            geometry={geometries.flangeHub}
            material={materials.machined}
          />
          {/* Bolt circle — 6 bolts equally spaced */}
          {[0, 1, 2, 3, 4, 5].map((b) => {
            const boltAngle = (b * Math.PI * 2) / 6;
            const boltRadius = MAIN_JOURNAL_RADIUS * 1.45;
            return (
              <group key={`bolt-${b}`}>
                <mesh
                  position={[
                    0.09,
                    Math.cos(boltAngle) * boltRadius,
                    Math.sin(boltAngle) * boltRadius,
                  ]}
                  rotation={[0, 0, Math.PI / 2]}
                  geometry={geometries.boltHead}
                  material={materials.bolt}
                />
                <mesh
                  position={[
                    0,
                    Math.cos(boltAngle) * boltRadius,
                    Math.sin(boltAngle) * boltRadius,
                  ]}
                  rotation={[0, 0, Math.PI / 2]}
                  geometry={geometries.boltHole}
                  material={materials.oilPassage}
                />
              </group>
            );
          })}
        </group>
      </group>
    </group>
  );
}
