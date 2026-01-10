import React from "react";
import "../styles/hexagon.css";

export type HexagonFunction = {
  id: string;
  title: string;
  subtitle: string;
  /** decimal score expected 1.0–5.0 */
  score: number;
  backgroundImageUrl?: string;
  ctaLabel?: string; // defaults to "Open"
};

export type HexagonProps = {
  functions: HexagonFunction[];
  className?: string;
  ariaLabel?: string;
  onHexClick?: (fn: HexagonFunction, index: number) => void;

  /** show/hide the color legend under the cluster */
  showLegend?: boolean;
  /** label displayed above the legend bar */
  legendLabel?: string;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(
  c1: [number, number, number],
  c2: [number, number, number],
  t: number
) {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ] as [number, number, number];
}

/**
 * score: 1.0–5.0
 * 1–3: green -> yellow
 * 3–5: yellow -> red
 * Smooth interpolation means every tenth is unique and monotonic.
 */
function scoreToRgb(scoreRaw: number): [number, number, number] {
  const score = clamp(scoreRaw, 1, 5);

  const GREEN: [number, number, number] = [46, 204, 113];
  const YELLOW: [number, number, number] = [241, 196, 15];
  const RED: [number, number, number] = [231, 76, 60];

  if (score <= 3) {
    const t = (score - 1) / 2;
    return lerpColor(GREEN, YELLOW, t);
  } else {
    const t = (score - 3) / 2;
    return lerpColor(YELLOW, RED, t);
  }
}

const POSITIONS = [
  "center",
  "topLeft",
  "top",
  "topRight",
  "bottomLeft",
  "bottom",
  "bottomRight",
] as const;

function RiskBar({ score }: { score: number }) {
  const clamped = clamp(score, 1, 5);
  // 1.0 => 0%, 5.0 => 100%
  const pct = ((clamped - 1) / 4) * 100;

  return (
    <div
      className="hx-risk"
      aria-label={`Risk level ${clamped.toFixed(1)} out of 5`}
    >
      <div className="hx-risk__track" aria-hidden="true">
        <div className="hx-risk__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function HexagonLegend({ label }: { label: string }) {
  return (
    <div className="hx-legend" aria-label={label}>
      <div className="hx-legend__label">{label}</div>

      <div className="hx-legend__barWrap">
        <div
          className="hx-legend__bar"
          role="img"
          aria-label="Risk gradient from 1.0 (green) to 5.0 (red)"
        />
        <div className="hx-legend__ticks" aria-hidden="true">
          <span className="hx-legend__tick hx-legend__tick--left">1.0</span>
          <span className="hx-legend__tick hx-legend__tick--mid">3.0</span>
          <span className="hx-legend__tick hx-legend__tick--right">5.0</span>
        </div>
      </div>

      <div className="hx-legend__hint" aria-hidden="true">
        Low risk → Medium → High risk
      </div>
    </div>
  );
}

function HexCell({
  fn,
  index,
  position,
  onHexClick,
}: {
  fn: HexagonFunction;
  index: number;
  position: (typeof POSITIONS)[number];
  onHexClick?: (fn: HexagonFunction, index: number) => void;
}) {
  const clickable = Boolean(onHexClick);
  const ctaLabel = fn.ctaLabel ?? "Open";

  const scoreClamped = clamp(fn.score, 1, 5);
  const [r, g, b] = scoreToRgb(scoreClamped);

  // Stronger overlay so the color coding reads clearly
  const overlayAlpha = lerp(0.3, 0.65, (scoreClamped - 1) / 4);

  const styleVars: React.CSSProperties = {
    ...(fn.backgroundImageUrl
      ? ({
          ["--hx-bg" as any]: `url('${fn.backgroundImageUrl}')`,
        } as React.CSSProperties)
      : null),
    ...({
      ["--hx-score-rgb" as any]: `${r} ${g} ${b}`,
      ["--hx-overlay-a" as any]: String(overlayAlpha),
    } as React.CSSProperties),
  };

  return (
    <button
      type="button"
      className={cx("hx", `hx--${position}`, clickable && "hx--clickable")}
      style={styleVars}
      onClick={() => onHexClick?.(fn, index)}
      aria-label={`${fn.title}. ${fn.subtitle}. Score ${scoreClamped.toFixed(
        1
      )} out of 5.`}
    >
      <span className="hx__stage" aria-hidden="true">
        <span className="hx__flipper">
          {/* FRONT */}
          <span className="hx__face hx__face--front">
            <span className="hx__clip">
              <span className="hx__base" />
              <span className="hx__overlay" />
              <span className="hx__shine" />
              <span className="hx__rim" />
            </span>

            <span className="hx__content">
              <span className="hx__title">{fn.title}</span>
              <span className="hx__subtitle">{fn.subtitle}</span>

              <span className="hx__scoreBig">{scoreClamped.toFixed(1)}</span>
              <RiskBar score={scoreClamped} />
            </span>
          </span>

          {/* BACK */}
          <span className="hx__face hx__face--back">
            <span className="hx__clip">
              <span className="hx__base hx__base--back" />
              <span className="hx__overlay" />
              <span className="hx__shine" />
              <span className="hx__rim" />
            </span>

            <span className="hx__content">
              <span className="hx__title">{fn.title}</span>
              <span className="hx__subtitle">
                Risk score: {scoreClamped.toFixed(1)} / 5.0
              </span>
              <RiskBar score={scoreClamped} />
              <span className="hx__cta">{ctaLabel}</span>
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}

export default function Hexagon({
  functions,
  className,
  ariaLabel = "Hexagon cluster",
  onHexClick,
  showLegend = true,
  legendLabel = "Risk score (1.0 → 5.0)",
}: HexagonProps) {
  const sliced = functions.slice(0, 7);

  return (
    <div
      className={cx("hx-wrap", className)}
      role="group"
      aria-label={ariaLabel}
    >
      <div className="hx-grid">
        {sliced.map((fn, idx) => (
          <HexCell
            key={fn.id}
            fn={fn}
            index={idx}
            position={POSITIONS[idx]}
            onHexClick={onHexClick}
          />
        ))}
      </div>

      {showLegend && <HexagonLegend label={legendLabel} />}
    </div>
  );
}
