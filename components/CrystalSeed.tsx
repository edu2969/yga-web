import type { CSSProperties } from "react";

type CrystalSeedProps = {
  /** Altura del prisma en px. Todo lo demás escala a partir de este valor. */
  size?: number;
  className?: string;
  style?: CSSProperties;
};

const SIDES = [0, 1, 2, 3, 4];
const SLICES = [0, 1, 2, 3, 4, 5];

// x / y en % de la escena, delay en s, sc = escala relativa
const SPARKLES = [
  { x: 30, y: 28, d: 0.0, sc: 1.0 },
  { x: 68, y: 36, d: 1.1, sc: 0.8 },
  { x: 42, y: 64, d: 2.0, sc: 1.2 },
  { x: 74, y: 70, d: 0.6, sc: 0.7 },
  { x: 24, y: 52, d: 2.7, sc: 0.6 },
  { x: 56, y: 22, d: 1.7, sc: 0.9 },
  { x: 52, y: 47, d: 3.1, sc: 0.8 },
];

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/**
 * Prisma pentagonal de cristal con una semilla dentro.
 * CSS puro, fondo transparente, sin hooks: sirve en Server y Client Components.
 */
export default function CrystalSeed({
  size = 240,
  className,
  style,
}: CrystalSeedProps) {
  return (
    <div
      className={["scene", className].filter(Boolean).join(" ")}
      style={{ ...v({ "--h": `${size}px` }), ...style }}
      aria-hidden="true"
    >
      {/* Resplandor cálido detrás del cristal */}
      <div className="layer floating">
        <div className="glow" />
      </div>

      {/* Objeto 3D */}
      <div className="layer floating">
        <div className="layer tilt">
          <div className="layer spin">
            <div className="prism">
              {/* Semilla (parte de la escena 3D, se ve a través del vidrio) */}
              <div className="seedWrap">
                <div className="seed">
                  {SLICES.map((k) => (
                    <i key={k} className="slice" style={v({ "--k": k })} />
                  ))}
                </div>
              </div>

              {/* Caras laterales */}
              {SIDES.map((i) => (
                <div key={i} className="face" style={v({ "--i": i })} />
              ))}

              {/* Tapas pentagonales */}
              <div
                className="cap capTop"
                style={v({ "--i": 2 })}
              />
              <div
                className="cap capBottom"
                style={v({ "--i": 4 })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Destellos 2D sobre el vidrio */}
      <div className="layer floating">
        {SPARKLES.map((s, n) => (
          <span
            key={n}
            className="sparkle"
            style={v({
              left: `${s.x}%`,
              top: `${s.y}%`,
              "--sc": s.sc,
              animationDelay: `${s.d}s`,
            })}
          />
        ))}
      </div>
    </div>
  );
}
