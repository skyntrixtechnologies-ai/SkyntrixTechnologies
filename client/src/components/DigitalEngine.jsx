import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { heroContent } from "../data/content";
import OrbitRings from "./engine/OrbitRings";
import CentralOrb from "./engine/CentralOrb";
import Pedestal from "./engine/Pedestal";
import ServiceConnector from "./engine/ServiceConnector";
import ServiceOrbitCard from "./engine/ServiceOrbitCard";

// ── Responsive orbital geometry ──────────────────────────────────────────────
// All sizing/positioning lives in CSS variables tuned per breakpoint:
//   --orb-size  central orb diameter
//   --ox/--oy   side-card center offsets from the orb center
//   --topY/--botY top/bottom card center offsets from the orb center
//   --card-w/--card-h card size
//   --compw/--comph composition box size
const CARD_POS = {
  web: { left: "50%", top: "calc(50% - var(--topY))" },
  design: { left: "calc(50% - var(--ox))", top: "calc(50% - var(--oy))" },
  mobile: { left: "calc(50% + var(--ox))", top: "calc(50% - var(--oy))" },
  cloud: { left: "calc(50% - var(--ox))", top: "calc(50% + var(--oy))" },
  software: { left: "calc(50% + var(--ox))", top: "calc(50% + var(--oy))" },
  marketing: { left: "50%", top: "calc(50% + var(--botY))" }
};

// Tiers: base (<480) → min-[480px] (480–767) → md (768–1023) → lg (1024–1279) → xl (≥1280)
const VARS = [
  "[--orb-size:130px]", "[--card-w:106px]", "[--card-h:48px]",
  "[--ox:108px]", "[--oy:84px]", "[--topY:118px]", "[--botY:118px]",
  "[--compw:322px]", "[--comph:284px]",

  "min-[480px]:[--orb-size:170px]", "min-[480px]:[--card-w:148px]", "min-[480px]:[--card-h:56px]",
  "min-[480px]:[--ox:150px]", "min-[480px]:[--oy:108px]", "min-[480px]:[--topY:156px]", "min-[480px]:[--botY:156px]",
  "min-[480px]:[--compw:448px]", "min-[480px]:[--comph:368px]",

  "md:[--orb-size:200px]", "md:[--card-w:168px]", "md:[--card-h:64px]",
  "md:[--ox:172px]", "md:[--oy:122px]", "md:[--topY:176px]", "md:[--botY:176px]",
  "md:[--compw:512px]", "md:[--comph:416px]",

  "lg:[--orb-size:200px]", "lg:[--card-w:160px]", "lg:[--card-h:62px]",
  "lg:[--ox:162px]", "lg:[--oy:118px]", "lg:[--topY:172px]", "lg:[--botY:172px]",
  "lg:[--compw:484px]", "lg:[--comph:406px]",

  "xl:[--orb-size:232px]", "xl:[--card-w:188px]", "xl:[--card-h:68px]",
  "xl:[--ox:192px]", "xl:[--oy:132px]", "xl:[--topY:194px]", "xl:[--botY:194px]",
  "xl:[--compw:574px]", "xl:[--comph:456px]"
];

export default function DigitalEngine() {
  const { services } = heroContent;
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(null);
  const containerRef = useRef(null);
  const orbRef = useRef(null);
  const cardRefs = useRef({});
  const orbitalRef = useRef([]);
  const [geo, setGeo] = useState({ orbCenter: { x: 50, y: 50 }, points: [], orbEdge: [] });

  const byId = (id) => services.find((s) => s.id === id);
  const orbital = ["web", "mobile", "cloud", "design", "software", "marketing"].map(byId).filter(Boolean);
  orbitalRef.current = orbital;

  // Measure orb + card centers relative to the container so the connector
  // lines always start at the orb rim and reach each card, at every size.
  useLayoutEffect(() => {
    const container = containerRef.current;
    const orbEl = orbRef.current;
    if (!container || !orbEl) return;

    const measure = () => {
      const cr = container.getBoundingClientRect();
      const or = orbEl.getBoundingClientRect();
      const cw = cr.width || 1;
      const ch = cr.height || 1;
      const orbCx = or.left + or.width / 2;
      const orbCy = or.top + or.height / 2;
      const R = or.width / 2;
      const orbCenter = { x: ((orbCx - cr.left) / cw) * 100, y: ((orbCy - cr.top) / ch) * 100 };
      const points = [];
      const orbEdge = [];
      for (const s of orbitalRef.current) {
        const el = cardRefs.current[s.id];
        if (!el) {
          points.push(orbCenter);
          orbEdge.push(orbCenter);
          continue;
        }
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        points.push({ x: ((cx - cr.left) / cw) * 100, y: ((cy - cr.top) / ch) * 100 });
        const dx = cx - orbCx;
        const dy = cy - orbCy;
        const len = Math.hypot(dx, dy) || 1;
        orbEdge.push({
          x: ((orbCx + (dx / len) * R - cr.left) / cw) * 100,
          y: ((orbCy + (dy / len) * R - cr.top) / ch) * 100
        });
      }
      setGeo({ orbCenter, points, orbEdge });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const entrance = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 24, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 } };
  const fade = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }
  });

  const handleHover = (id) => setHovered(id);

  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <motion.div
        {...entrance}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full"
      >
        <div
          ref={containerRef}
          className={`relative mx-auto ${VARS.join(" ")}`}
          style={{ width: "var(--compw)", height: "var(--comph)" }}
        >
          {/* Ambient background */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -left-[6%] top-[10%] aspect-square w-[34%] rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -right-[6%] top-[36%] aspect-square w-[30%] rounded-full bg-secondary/15 blur-3xl" />
            <div className="absolute inset-0 bg-dots opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
          </div>

          {/* Connectors (orb → cards) */}
          <ServiceConnector services={orbital} hovered={hovered} geo={geo} />

          {/* Orbit rings */}
          <OrbitRings center={{ x: 50, y: 50 }} />

          {/* 3D pedestal */}
          <div
            className="absolute left-1/2 z-[5] aspect-[2.2/1]"
            style={{ top: "calc(50% + var(--orb-size) * 0.18)", width: "var(--orb-size)", transform: "translateX(-50%)" }}
          >
            <Pedestal />
          </div>

          {/* Central 3D orb */}
          <div
            ref={orbRef}
            className="absolute left-1/2 top-1/2 z-10"
            style={{ width: "var(--orb-size)", height: "var(--orb-size)", transform: "translate(-50%,-50%)" }}
          >
            <CentralOrb />
          </div>

          {/* Service cards on the orbit */}
          {orbital.map((s, i) => {
            const pos = CARD_POS[s.id] || { left: "50%", top: "50%" };
            return (
              <div
                key={s.id}
                ref={(el) => {
                  cardRefs.current[s.id] = el;
                }}
                className="absolute z-30"
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: "var(--card-w)",
                  height: "var(--card-h)",
                  transform: "translate(-50%,-50%)"
                }}
              >
                <motion.div {...fade(0.5 + i * 0.08)} className="h-full w-full">
                  <div className="animate-float-soft h-full w-full" style={{ animationDelay: `${i * 0.55}s` }}>
                    <ServiceOrbitCard service={s} onHover={handleHover} />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
