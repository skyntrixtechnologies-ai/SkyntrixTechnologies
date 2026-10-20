import { motion, useReducedMotion } from "framer-motion";

const innerParticles = [
  { x: "22%", y: "30%", s: 2, o: 0.9, d: 0 },
  { x: "60%", y: "22%", s: 3, o: 0.7, d: 1.2 },
  { x: "70%", y: "45%", s: 2, o: 0.8, d: 2.1 },
  { x: "35%", y: "60%", s: 2, o: 0.6, d: 0.7 },
  { x: "50%", y: "72%", s: 3, o: 0.75, d: 1.6 },
  { x: "78%", y: "68%", s: 2, o: 0.6, d: 2.6 },
  { x: "30%", y: "42%", s: 2, o: 0.85, d: 3.1 },
  { x: "64%", y: "58%", s: 2, o: 0.7, d: 0.4 },
  { x: "45%", y: "38%", s: 2, o: 0.9, d: 1.9 },
  { x: "20%", y: "52%", s: 2, o: 0.6, d: 2.4 },
  { x: "58%", y: "38%", s: 2, o: 0.8, d: 3.4 },
  { x: "42%", y: "52%", s: 2, o: 0.7, d: 0.9 },
  { x: "72%", y: "30%", s: 2, o: 0.65, d: 2.8 },
  { x: "28%", y: "66%", s: 2, o: 0.7, d: 1.3 }
];

export default function CentralOrb({ className = "" }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`relative h-full w-full ${className}`}
    >
      <div className="animate-orb-float relative h-full w-full">
        {/* Soft outer halo */}
        <div className="absolute -inset-10 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.4),rgba(37,99,235,0.18),transparent_70%)] blur-2xl" aria-hidden="true" />

        {/* 3D sphere body */}
        <div className="relative h-full w-full rounded-full bg-[radial-gradient(circle_at_30%_26%,rgba(233,213,255,0.95)_0%,rgba(196,181,253,0.55)_8%,rgba(147,51,234,0.9)_26%,rgba(76,29,149,0.95)_48%,rgba(49,46,129,0.98)_70%,#1E1B4B_100%)] shadow-[0_18px_70px_-12px_rgba(124,58,237,0.55),0_0_120px_rgba(37,99,235,0.3)]">
          {/* Blue rim light */}
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,transparent_58%,rgba(59,130,246,0.35)_80%,rgba(59,130,246,0)_98%)]" aria-hidden="true" />
          {/* Terminator shadow (depth) */}
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_30%,transparent_38%,rgba(2,6,23,0.4)_76%,rgba(2,6,23,0.82)_100%)]" aria-hidden="true" />
          {/* Glass specular highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_30%_24%,rgba(255,255,255,0.65),rgba(255,255,255,0.12)_38%,transparent_52%)]" aria-hidden="true" />
          {/* Reflection streak */}
          <div className="pointer-events-none absolute left-[16%] top-[10%] h-[24%] w-[34%] -rotate-[24deg] rounded-full bg-white/25 blur-md" aria-hidden="true" />

          {/* Equator + meridian rings */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <ellipse cx="50" cy="50" rx="46" ry="17" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" />
            <path d="M50 4 Q 78 50 50 96 M50 4 Q 22 50 50 96" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.5" />
          </svg>

          {/* Internal particles */}
          {innerParticles.map((p) => (
            <span
              key={p.x + p.y}
              className="absolute rounded-full bg-white animate-node-pulse"
              style={{
                left: p.x,
                top: p.y,
                width: `${p.s}px`,
                height: `${p.s}px`,
                opacity: p.o,
                animationDelay: `${p.d}s`,
                animationDuration: `${3 + p.d}s`
              }}
              aria-hidden="true"
            />
          ))}

          {/* Center text */}
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-display text-xl font-extrabold uppercase leading-none tracking-[0.08em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-[28px] lg:text-[32px]">
                SKYNTRIX
              </p>
              <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.34em] text-white/80 sm:text-[11px] lg:text-[12px]">
                DIGITAL ENGINE
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
