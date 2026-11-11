import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import {
  FaCartShopping,
  FaTruckFast,
  FaShieldHalved,
  FaTag,
  FaSignal,
  FaWifi,
  FaBatteryFull,
  FaMagnifyingGlass,
  FaPlus,
  FaMobileScreenButton,
  FaHouse,
  FaHeart,
  FaUser
} from "react-icons/fa6";
import logo from "../assets/logo.png";

// Illustrative mobile-shop storefront, shown inside a phone-shaped device
// frame for the homepage hero. Built entirely from CSS/markup (no stock
// imagery) and purely decorative, so it is hidden from assistive tech.
// Prices/stock values are UI decoration, not real data.

const products = [
  { name: "Nova X12 128GB", price: "₹18,999" },
  { name: "Pulse S5 Pro", price: "₹24,499" },
  { name: "Orbit Lite", price: "₹11,999" }
];

const categories = ["All", "Phones", "Accessories"];

const navItems = [
  { icon: FaHouse, active: true },
  { icon: FaMagnifyingGlass, active: false },
  { icon: FaHeart, active: false },
  { icon: FaUser, active: false }
];

// Resting pose + pointer-driven swing range for the 3D tilt scene, in degrees.
const IDLE = { x: 3, y: -8 };
const RANGE = { x: 11, y: 15 };

function FloatCard({ icon: Ico, title, sub, className = "", delay = "0s", z = 70 }) {
  return (
    <div className={`absolute z-20 hidden xl:block ${className}`} style={{ transform: `translateZ(${z}px)` }}>
      <div
        className="w-max min-w-[176px] animate-float-soft rounded-2xl border border-white/80 bg-white/85 p-3 shadow-elevated backdrop-blur-xl"
        style={{ animationDelay: delay }}
      >
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-gradient text-white shadow-[0_8px_18px_-8px_rgba(114,0,245,0.7)]">
            <Ico className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="whitespace-nowrap text-[13px] font-semibold text-ink">{title}</p>
            <p className="whitespace-nowrap text-[11px] text-muted">{sub}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TiltScene({ children }) {
  const reduceMotion = useReducedMotion();
  const sceneRef = useRef(null);
  const controlsRef = useRef({ x: null, y: null });

  const targetX = useMotionValue(IDLE.x);
  const targetY = useMotionValue(IDLE.y);
  const rotateX = useSpring(targetX, { stiffness: 120, damping: 16, mass: 0.6 });
  const rotateY = useSpring(targetY, { stiffness: 120, damping: 16, mass: 0.6 });

  // Glossy highlight that drifts opposite the tilt, like light catching glass.
  const sheenX = useTransform(rotateY, [IDLE.y - RANGE.y, IDLE.y + RANGE.y], [20, 80]);
  const sheenY = useTransform(rotateX, [IDLE.x - RANGE.x, IDLE.x + RANGE.x], [80, 20]);

  useEffect(() => {
    if (reduceMotion) return undefined;
    controlsRef.current.y = animate(targetY, [IDLE.y, IDLE.y + 3, IDLE.y], {
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut"
    });
    controlsRef.current.x = animate(targetX, [IDLE.x, IDLE.x - 2, IDLE.x], {
      duration: 9,
      repeat: Infinity,
      ease: "easeInOut"
    });
    return () => {
      controlsRef.current.x?.stop();
      controlsRef.current.y?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  function handlePointerMove(e) {
    if (reduceMotion || e.pointerType === "touch" || !sceneRef.current) return;
    controlsRef.current.x?.stop();
    controlsRef.current.y?.stop();
    const rect = sceneRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    targetX.set(IDLE.x - py * RANGE.x * 2);
    targetY.set(IDLE.y + px * RANGE.y * 2);
  }

  function handlePointerLeave() {
    if (reduceMotion) return;
    controlsRef.current.x = animate(targetX, IDLE.x, { type: "spring", stiffness: 90, damping: 14 });
    controlsRef.current.y = animate(targetY, IDLE.y, { type: "spring", stiffness: 90, damping: 14 }).then?.(() => {
      controlsRef.current.y = animate(targetY, [IDLE.y, IDLE.y + 3, IDLE.y], {
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut"
      });
    });
  }

  return (
    <div style={{ perspective: 1800 }} className="relative">
      <motion.div
        ref={sceneRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 rounded-[2.75rem] opacity-70 mix-blend-overlay"
          style={{
            background: useTransform(
              [sheenX, sheenY],
              ([x, y]) => `radial-gradient(45% 55% at ${x}% ${y}%, rgba(255,255,255,0.85), transparent 70%)`
            )
          }}
        />
        {children}
      </motion.div>
    </div>
  );
}

export default function HeroVisual() {
  return (
    <div className="relative mx-auto flex w-full max-w-[640px] justify-center px-0 py-4 sm:px-10 sm:py-12 lg:max-w-none lg:px-4 lg:pb-8 lg:pt-0" aria-hidden="true">
      {/* Ambient light */}
      <div className="pointer-events-none absolute left-[8%] top-[6%] h-64 w-64 rounded-full bg-primary/20 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-[4%] right-[4%] h-64 w-64 rounded-full bg-secondary/20 blur-[90px]" />

      {/* Geometric accents echoing the logo's dots */}
      <span className="absolute right-[9%] top-[3%] hidden h-3 w-3 rounded-full bg-primary-gradient sm:block" />
      <span className="absolute right-[4%] top-[11%] hidden h-1.5 w-1.5 rounded-full bg-secondary sm:block" />
      <span className="absolute bottom-[2%] left-[16%] hidden h-16 w-16 rounded-full border border-dashed border-primary/25 animate-spin-slow sm:block" />

      <TiltScene>
        {/* Phone device frame */}
        <div className="relative z-10 w-[250px] sm:w-[270px]">
          {/* Side buttons */}
          <span className="absolute -left-[2px] top-[108px] h-9 w-[3px] rounded-l-full bg-ink/70" />
          <span className="absolute -left-[2px] top-[150px] h-14 w-[3px] rounded-l-full bg-ink/70" />
          <span className="absolute -right-[2px] top-[130px] h-16 w-[3px] rounded-r-full bg-ink/70" />

          <div className="rounded-[2.6rem] bg-ink p-[9px] shadow-[0_2px_4px_rgba(23,18,31,0.04),0_40px_80px_-30px_rgba(72,24,160,0.45)]">
            <div className="relative flex min-h-[440px] flex-col overflow-hidden rounded-[2.15rem] bg-white sm:min-h-[470px]">
              {/* Notch */}
              <div className="absolute left-1/2 top-0 z-20 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-ink" />

              {/* Status bar */}
              <div className="flex items-center justify-between px-5 pb-1 pt-2.5 text-[10px] font-semibold text-ink">
                <span>9:41</span>
                <span className="flex items-center gap-1 text-ink/70">
                  <FaSignal className="h-2.5 w-2.5" />
                  <FaWifi className="h-2.5 w-2.5" />
                  <FaBatteryFull className="h-3 w-3" />
                </span>
              </div>

              {/* App header */}
              <div className="flex items-center justify-between px-4 pt-2">
                <div className="flex items-center gap-1.5">
                  <img src={logo} alt="" width="16" height="16" className="h-4 w-4" />
                  <div>
                    <p className="text-[12px] font-bold leading-none text-ink">Mobile Store</p>
                    <p className="mt-0.5 text-[8.5px] text-muted">Trending this week</p>
                  </div>
                </div>
                <span className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lavender text-primary">
                  <FaCartShopping className="h-3 w-3" />
                  <span className="absolute -right-0.5 -top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-primary-gradient text-[7px] font-bold text-white">
                    3
                  </span>
                </span>
              </div>

              {/* Search */}
              <div className="mx-4 mt-3 flex items-center gap-2 rounded-full border border-line bg-lavender/60 px-3 py-1.5">
                <FaMagnifyingGlass className="h-2.5 w-2.5 text-muted" />
                <span className="text-[9px] text-muted">Search smartphones</span>
              </div>

              {/* Category chips */}
              <div className="mt-2.5 flex gap-1.5 px-4">
                {categories.map((c, i) => (
                  <span
                    key={c}
                    className={`rounded-full px-2.5 py-1 text-[8.5px] font-semibold ${
                      i === 1 ? "bg-primary-gradient text-white" : "bg-lavender text-muted"
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Product list */}
              <div className="mt-2.5 space-y-2 px-4">
                {products.map((p) => (
                  <div key={p.name} className="flex items-center gap-2.5 rounded-xl border border-line bg-white p-2 shadow-card">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-lavender text-primary">
                      <FaMobileScreenButton className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[9.5px] font-semibold text-ink">{p.name}</p>
                      <p className="text-[9px] text-muted">{p.price}</p>
                    </div>
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-gradient text-white">
                      <FaPlus className="h-2 w-2" />
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex-1" />

              {/* Bottom nav */}
              <div className="mt-3 flex items-center justify-around border-t border-line px-2 py-2.5">
                {navItems.map(({ icon: Ico, active }, i) => (
                  <span
                    key={i}
                    className={`grid h-7 w-7 place-items-center rounded-lg ${active ? "bg-lavender text-primary" : "text-ink/25"}`}
                  >
                    <Ico className="h-3 w-3" />
                  </span>
                ))}
              </div>

              {/* Home indicator */}
              <div className="flex justify-center pb-2">
                <span className="h-1 w-20 rounded-full bg-ink/15" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating value-prop cards (xl+ only, where there's room to clear the screen edges), popped forward in Z so they visibly separate when the scene tilts */}
        <FloatCard icon={FaCartShopping} title="Easy Checkout" sub="One-tap payments" className="-left-36 top-6" z={70} />
        <FloatCard icon={FaTruckFast} title="Fast Delivery" sub="Pan-India shipping" className="-right-36 top-[34%]" delay="1.2s" z={90} />
        <FloatCard icon={FaShieldHalved} title="Secure Payments" sub="100% buyer protection" className="-left-36 bottom-16" delay="2.4s" z={60} />
        <FloatCard icon={FaTag} title="Best Price" sub="Daily deals & offers" className="-right-36 bottom-6" delay="0.6s" z={100} />
      </TiltScene>
    </div>
  );
}
