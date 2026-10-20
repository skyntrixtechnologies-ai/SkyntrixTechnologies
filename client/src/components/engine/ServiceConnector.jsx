import { motion, useReducedMotion } from "framer-motion";

function ConnectorNode({ point, delay, active }) {
  return (
    <span
      className="absolute z-20"
      style={{ left: `${point.x}%`, top: `${point.y}%`, transform: "translate(-50%,-50%)" }}
    >
      <motion.span
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay, ease: "backOut" }}
        className={`grid h-2.5 w-2.5 place-items-center rounded-full border bg-white/50 shadow-[0_0_10px_rgba(129,140,248,0.85)] ${active
          ? "border-white/90 bg-white/85 shadow-[0_0_16px_rgba(168,85,247,0.95)]"
          : "border-indigo-300/70"
        }`}
      >
        <span className="h-1 w-1 animate-node-pulse rounded-full bg-white" />
      </motion.span>
    </span>
  );
}

// Connectors between the central orb and every service card.
// `geo` carries measured percentage coordinates (orbCenter, card points and
// orb-rim points) computed by DigitalEngine, so the lines follow the layout
// at every breakpoint. `hovered` (a service id) brightens that card's line.
export default function ServiceConnector({ services, hovered, geo }) {
  const reduceMotion = useReducedMotion();
  const { points = [], orbEdge = [] } = geo;

  return (
    <>
      <svg className="absolute inset-0 z-[8] h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="engineConn" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        {services.map((s, i) => {
          const a = orbEdge[i] || { x: 50, y: 50 };
          const b = points[i] || { x: 50, y: 50 };
          const active = hovered === s.id;
          return (
            <g key={s.id}>
              {/* soft glow underlay */}
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="url(#engineConn)" strokeWidth={active ? 6 : 3} opacity={active ? 0.45 : 0.14} vectorEffect="non-scaling-stroke" />
              {/* main gradient line */}
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="url(#engineConn)" strokeWidth={active ? 2 : 1.2} opacity={active ? 1 : 0.5} vectorEffect="non-scaling-stroke" />
              {/* travelling pulse on the hovered connection */}
              {active && !reduceMotion && (
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  pathLength="100" stroke="url(#engineConn)" strokeWidth="2"
                  strokeLinecap="round" strokeDasharray="2 14"
                  className="animate-dashflow"
                  vectorEffect="non-scaling-stroke" opacity="0.95"
                />
              )}
            </g>
          );
        })}
      </svg>

      {services.map((s, i) => (
        <ConnectorNode key={`orb-${s.id}`} point={orbEdge[i] || { x: 50, y: 50 }} delay={0.7 + i * 0.08} active={hovered === s.id} />
      ))}
    </>
  );
}
