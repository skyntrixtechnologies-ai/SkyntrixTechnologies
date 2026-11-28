import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "skyntrix_splash_seen";
const TAGLINE = "Turning Ideas into Digital Solutions";
const WORDMARK = "Skyntrix";

export default function SplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const fadeStartMs = reducedMotion ? 900 : 3000;
  const finishMs = reducedMotion ? 1300 : 3600;

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(false);
      onComplete?.();
      return undefined;
    }
    sessionStorage.setItem(STORAGE_KEY, "1");

    const fadeTimer = setTimeout(() => setFadeOut(true), fadeStartMs);
    const finishTimer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, finishMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete, fadeStartMs, finishMs]);

  if (!visible) return null;

  const letterDelay = (i) => (reducedMotion ? 0 : 0.5 + i * 0.045);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-white transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        fadeOut ? "pointer-events-none scale-[1.04] opacity-0 blur-[6px]" : "opacity-100"
      }`}
    >
      {/* Faint brand dot-grid for texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(rgba(114,0,245,0.09) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient brand glow orbs, matching the site's existing visual language */}
      <div
        className={`pointer-events-none absolute -left-16 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:h-80 sm:w-80 ${
          reducedMotion ? "" : "animate-orb-float"
        }`}
      />
      <div
        className={`pointer-events-none absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-secondary/10 blur-3xl [animation-delay:1.4s] sm:h-96 sm:w-96 ${
          reducedMotion ? "" : "animate-orb-float"
        }`}
      />
      <div
        className="pointer-events-none absolute h-[clamp(260px,45vw,520px)] w-[clamp(260px,45vw,520px)] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(114,0,245,0.1) 0%, rgba(32,72,245,0.06) 45%, rgba(255,255,255,0) 70%)",
          animation: reducedMotion ? "none" : "splash-pulse-glow 3s ease-in-out infinite alternate",
        }}
      />

      <div className="z-[2] flex flex-col items-center gap-4 px-5 sm:flex-row sm:gap-7">
        <div className="h-[clamp(66px,13vw,120px)] w-[clamp(72px,14vw,130px)] shrink-0 drop-shadow-[0_18px_30px_rgba(114,0,245,0.18)]">
          <svg viewBox="0 0 240 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
            <defs>
              <linearGradient id="skyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7200F5" />
                <stop offset="45%" stopColor="#8A00F5" />
                <stop offset="100%" stopColor="#2048F5" />
              </linearGradient>
              <linearGradient id="skyGrad2" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#8A00F5" />
                <stop offset="100%" stopColor="#2048F5" />
              </linearGradient>
              <linearGradient id="skyGrad3" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#7200F5" />
                <stop offset="45%" stopColor="#8A00F5" />
                <stop offset="100%" stopColor="#2048F5" />
              </linearGradient>
            </defs>

            {/* Base wave */}
            <path
              d="M32 184 C29 187 24 183 26 179 C48 136 92 112 135 114 C162 115 190 126 218 139 C223 141 223 148 218 151 L182 174 C176 178 168 178 162 174 C138 158 112 150 86 154 C64 157 46 169 32 184 Z"
              fill="url(#skyGrad3)"
              style={
                reducedMotion
                  ? undefined
                  : { opacity: 0, transform: "translateY(18px)", animation: "splash-slide-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards" }
              }
            />
            {/* Middle wing */}
            <path
              d="M42 106 C38 106 37 101 41 99 L79 81 C85 78 92 78 98 80 L162 101 C166 102 165 106 161 106 L42 106 Z"
              fill="url(#skyGrad1)"
              style={
                reducedMotion
                  ? undefined
                  : { opacity: 0, transform: "translateX(-16px)", animation: "splash-slide-right 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s forwards" }
              }
            />
            {/* Arrow / wing */}
            <path
              d="M126 65 L204 35 C209 33 213 38 210 43 L174 96 C171 100 165 99 164 94 L159 77 L127 71 C122 70 122 66 126 65 Z"
              fill="url(#skyGrad1)"
              style={
                reducedMotion
                  ? undefined
                  : { opacity: 0, transform: "translate(-12px, 12px) scale(0.9)", animation: "splash-launch-arrow 0.75s cubic-bezier(0.16,1,0.3,1) 0.4s forwards" }
              }
            />
            {/* Dots with a soft sonar ping */}
            {[
              { cx: 94, cy: 46, delay: 0.65 },
              { cx: 141, cy: 25, delay: 0.78 },
            ].map(({ cx, cy, delay }) => (
              <g key={cx}>
                {!reducedMotion && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="7.5"
                    fill="none"
                    stroke="url(#skyGrad2)"
                    strokeWidth="1.5"
                    style={{
                      opacity: 0,
                      transformOrigin: `${cx}px ${cy}px`,
                      animation: `splash-dot-ping 1.6s ease-out ${delay + 0.15}s infinite`,
                    }}
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r="7.5"
                  fill="url(#skyGrad2)"
                  style={
                    reducedMotion
                      ? undefined
                      : {
                          opacity: 0,
                          transform: "scale(0)",
                          transformOrigin: `${cx}px ${cy}px`,
                          animation: `splash-pop-dot 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s forwards`,
                        }
                  }
                />
              </g>
            ))}
          </svg>
        </div>

        <div className="flex flex-col items-center sm:items-end">
          <h1 className="font-display flex text-[clamp(2.2rem,6.5vw,4.5rem)] font-extrabold leading-none tracking-[-0.03em] text-[#05051e]">
            {WORDMARK.split("").map((ch, i) => (
              <span
                key={i}
                className="inline-block"
                style={
                  reducedMotion
                    ? undefined
                    : { opacity: 0, transform: "translateY(14px)", animation: `splash-letter-up 0.55s cubic-bezier(0.16,1,0.3,1) ${letterDelay(i)}s forwards` }
                }
              >
                {ch}
              </span>
            ))}
          </h1>
          <span
            className="mt-0.5 text-[clamp(0.85rem,2.1vw,1.45rem)] font-bold leading-tight tracking-[0.01em] text-secondary"
            style={
              reducedMotion
                ? undefined
                : { opacity: 0, transform: "translateX(16px)", animation: "splash-text-reveal 0.8s cubic-bezier(0.16,1,0.3,1) 0.95s forwards" }
            }
          >
            Technologies
          </span>
          <span
            className="mt-2.5 text-[clamp(0.6rem,1.4vw,0.78rem)] font-semibold uppercase tracking-[0.22em] text-muted/80"
            style={
              reducedMotion
                ? undefined
                : { opacity: 0, transform: "translateY(8px)", animation: "splash-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 1.25s forwards" }
            }
          >
            {TAGLINE}
          </span>
        </div>
      </div>
    </div>
  );
}
