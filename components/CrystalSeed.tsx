"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

type CrystalSeedProps = {
  /** Escala de la escena en px. Todo lo demás escala a partir de este valor. */
  size?: number;
  className?: string;
  style?: CSSProperties;
};

const SLICES = [0, 1, 2, 3, 4, 5];
const PHI = (1 + Math.sqrt(5)) / 2;
const NORMAL_COMPONENT = 1 / Math.sqrt(1 + PHI * PHI);
const GOLDEN_COMPONENT = PHI * NORMAL_COMPONENT;
const DODECAHEDRON_APOTHEM = 1.11351636441161;
const DODECAHEDRON_NORMALS = [
  [-GOLDEN_COMPONENT, -NORMAL_COMPONENT, 0],
  [-NORMAL_COMPONENT, 0, -GOLDEN_COMPONENT],
  [0, -GOLDEN_COMPONENT, -NORMAL_COMPONENT],
  [-NORMAL_COMPONENT, 0, GOLDEN_COMPONENT],
  [0, -GOLDEN_COMPONENT, NORMAL_COMPONENT],
  [-GOLDEN_COMPONENT, NORMAL_COMPONENT, 0],
  [0, GOLDEN_COMPONENT, -NORMAL_COMPONENT],
  [0, GOLDEN_COMPONENT, NORMAL_COMPONENT],
  [GOLDEN_COMPONENT, -NORMAL_COMPONENT, 0],
  [NORMAL_COMPONENT, 0, -GOLDEN_COMPONENT],
  [NORMAL_COMPONENT, 0, GOLDEN_COMPONENT],
  [GOLDEN_COMPONENT, NORMAL_COMPONENT, 0],
];
const DODECAHEDRON_VERTICES = (() => {
  const vertices: [number, number, number][] = [];
  const scale = PHI / 2;
  for (const x of [-1, 1]) {
    for (const y of [-1, 1]) {
      for (const z of [-1, 1]) {
        vertices.push([x * scale, y * scale, z * scale]);
      }
    }
  }
  for (const a of [-1, 1]) {
    for (const b of [-1, 1]) {
      vertices.push(
        [0, (a / PHI) * scale, b * PHI * scale],
        [(a / PHI) * scale, b * PHI * scale, 0],
        [a * PHI * scale, 0, (b / PHI) * scale],
      );
    }
  }
  return vertices;
})();
const DODECAHEDRON_FACES = DODECAHEDRON_NORMALS.map((normal) => {
  const [nx, ny, nz] = normal;
  const yaw = Math.atan2(nx, nz);
  const pitch = -Math.asin(ny);
  const cosineYaw = Math.cos(yaw);
  const sineYaw = Math.sin(yaw);
  const cosinePitch = Math.cos(pitch);
  const sinePitch = Math.sin(pitch);
  const vertices = DODECAHEDRON_VERTICES.filter(
    ([x, y, z]) =>
      x * nx + y * ny + z * nz > DODECAHEDRON_APOTHEM - 1e-7,
  );
  const localAngles = vertices
    .map(([x, y, z]) => {
      const dx = x - DODECAHEDRON_APOTHEM * nx;
      const dy = y - DODECAHEDRON_APOTHEM * ny;
      const dz = z - DODECAHEDRON_APOTHEM * nz;
      const localX = dx * cosineYaw - dz * sineYaw;
      const localY =
        dx * sineYaw * sinePitch +
        dy * cosinePitch +
        dz * cosineYaw * sinePitch;
      return (Math.atan2(localY, localX) + 2 * Math.PI) % (2 * Math.PI);
    })
    .sort((a, b) => a - b);

  return {
    yaw,
    pitch,
    roll: localAngles[0] - (Math.PI * 54) / 180,
  };
});
const MERCURY_GRADIENT =
  "radial-gradient(ellipse at 35% 24%, #fff 0%, #f4f7fa 12%, #aeb9c5 28%, #f9fcff 39%, #727f8c 55%, #e8edf2 68%, #8794a0 82%, #f8fbff 100%)";
const SPARKLES = [
  { x: 30, y: 28, scale: 0.7 },
  { x: 68, y: 36, scale: 0.55 },
  { x: 42, y: 64, scale: 0.65 },
];

const cssVars = (vars: Record<string, string | number>) =>
  vars as CSSProperties;

/**
 * Dodecaedro de cristal con una semilla dentro.
 * Geometría 3D calculada a partir de los vértices de un dodecaedro regular.
 */
export default function CrystalSeed({
  size = 240,
  className,
  style,
}: CrystalSeedProps) {
  const dodecahedronRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateAnimationState = () => {
      if (dodecahedronRef.current) {
        dodecahedronRef.current.style.animationPlayState = document.hidden
          ? "paused"
          : "running";
      }
    };

    updateAnimationState();
    document.addEventListener("visibilitychange", updateAnimationState);
    return () =>
      document.removeEventListener("visibilitychange", updateAnimationState);
  }, []);

  return (
    <div
      className={["scene", className].filter(Boolean).join(" ")}
      style={{
        ...cssVars({
          "--h": `${size}px`,
          "--mercury-gradient": MERCURY_GRADIENT,
        }),
        ...style,
      }}
      aria-hidden="true"
    >
      <div className="glow" />

      <div ref={dodecahedronRef} className="dodecahedron spin">
        <div className="seedWrap">
          <div className="seed">
            {SLICES.map((slice) => (
              <i
                key={slice}
                className="slice"
                style={cssVars({ "--slice": slice })}
              />
            ))}
          </div>
          <div className="plumule">
            <span className="plumuleSprout" />
          </div>
        </div>

        {DODECAHEDRON_FACES.map(({ yaw, pitch, roll }, index) => (
          <div
            key={index}
            className="dodecahedronFace"
            style={cssVars({
              "--face": index,
              "--yaw": `${(yaw * 180) / Math.PI}deg`,
              "--pitch": `${(pitch * 180) / Math.PI}deg`,
              "--roll": `${(roll * 180) / Math.PI}deg`,
            })}
          />
        ))}
      </div>

      <div className="sparkles">
        {SPARKLES.map((sparkle, index) => (
          <span
            key={index}
            className="sparkle"
            style={cssVars({
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              "--sparkle-scale": sparkle.scale,
            })}
          />
        ))}
      </div>
    </div>
  );
}
