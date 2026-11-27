import { useEffect, useState } from "react";

const STORAGE_KEY = "skyntrix_splash_seen";
const FADE_START_MS = 2800;
const FINISH_MS = 3400;

export default function SplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(false);
      onComplete?.();
      return undefined;
    }

    sessionStorage.setItem(STORAGE_KEY, "1");
    const fadeTimer = setTimeout(() => setFadeOut(true), FADE_START_MS);
    const finishTimer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, FINISH_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-white transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        fadeOut ? "pointer-events-none scale-[1.03] opacity-0" : "opacity-100"
      }`}
    >
      {/* Soft ambient glow behind the logo */}
      <div
        className="pointer-events-none absolute h-[clamp(260px,45vw,520px)] w-[clamp(260px,45vw,520px)] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(114,9,183,0.08) 0%, rgba(0,119,255,0.05) 45%, rgba(255,255,255,0) 70%)",
          animation: "splash-pulse-glow 3s ease-in-out infinite alternate",
        }}
      />

      <div className="z-[2] flex flex-col items-center gap-3.5 px-5 sm:flex-row sm:gap-7">
        <div className="h-[clamp(66px,13vw,120px)] w-[clamp(72px,14vw,130px)] shrink-0">
          <svg viewBox="0 0 240 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
            <defs>
              <linearGradient id="skyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9D00FF" />
                <stop offset="50%" stopColor="#6A00F4" />
                <stop offset="100%" stopColor="#0066FF" />
              </linearGradient>
              <linearGradient id="skyGrad2" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#B5179E" />
                <stop offset="50%" stopColor="#7209B7" />
                <stop offset="100%" stopColor="#3A0CA3" />
              </linearGradient>
              <linearGradient id="skyGrad3" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#560BAD" />
                <stop offset="45%" stopColor="#7209B7" />
                <stop offset="100%" stopColor="#0077FF" />
              </linearGradient>
            </defs>

            {/* Base wave */}
            <path
              d="M32 184 C29 187 24 183 26 179 C48 136 92 112 135 114 C162 115 190 126 218 139 C223 141 223 148 218 151 L182 174 C176 178 168 178 162 174 C138 158 112 150 86 154 C64 157 46 169 32 184 Z"
              fill="url(#skyGrad3)"
              style={{ opacity: 0, transform: "translateY(18px)", animation: "splash-slide-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards" }}
            />
            {/* Middle wing */}
            <path
              d="M42 106 C38 106 37 101 41 99 L79 81 C85 78 92 78 98 80 L162 101 C166 102 165 106 161 106 L42 106 Z"
              fill="url(#skyGrad1)"
              style={{ opacity: 0, transform: "translateX(-16px)", animation: "splash-slide-right 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s forwards" }}
            />
            {/* Arrow / wing */}
            <path
              d="M126 65 L204 35 C209 33 213 38 210 43 L174 96 C171 100 165 99 164 94 L159 77 L127 71 C122 70 122 66 126 65 Z"
              fill="url(#skyGrad1)"
              style={{ opacity: 0, transform: "translate(-12px, 12px) scale(0.9)", animation: "splash-launch-arrow 0.75s cubic-bezier(0.16,1,0.3,1) 0.4s forwards" }}
            />
            {/* Dots */}
            <circle
              cx="94" cy="46" r="7.5" fill="url(#skyGrad2)"
              style={{ opacity: 0, transform: "scale(0)", transformOrigin: "94px 46px", animation: "splash-pop-dot 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.65s forwards" }}
            />
            <circle
              cx="141" cy="25" r="7.5" fill="url(#skyGrad2)"
              style={{ opacity: 0, transform: "scale(0)", transformOrigin: "141px 25px", animation: "splash-pop-dot 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.78s forwards" }}
            />
          </svg>
        </div>

        <div
          className="flex flex-col items-end"
          style={{ opacity: 0, transform: "translateX(16px)", animation: "splash-text-reveal 0.8s cubic-bezier(0.16,1,0.3,1) 0.45s forwards" }}
        >
          <h1 className="font-display text-[clamp(2.2rem,6.5vw,4.5rem)] font-extrabold leading-none tracking-[-0.03em] text-[#05051e]">
            Skyntrix
          </h1>
          <span className="mt-0.5 text-[clamp(0.85rem,2.1vw,1.45rem)] font-bold leading-tight tracking-[0.01em] text-[#0066ff]">
            Technologies
          </span>
        </div>
      </div>

      {/* Bottom loading indicator */}
      <div className="absolute bottom-[clamp(32px,7vh,60px)] h-1 w-[clamp(140px,28vw,240px)] overflow-hidden rounded-full bg-[#eef2ff]">
        <div
          className="h-full w-full rounded-full bg-gradient-to-r from-[#7209b7] to-[#0066ff]"
          style={{ transform: "translateX(-100%)", animation: "splash-load-progress 2.6s cubic-bezier(0.4,0,0.2,1) 0.2s forwards" }}
        />
      </div>
    </div>
  );
}
