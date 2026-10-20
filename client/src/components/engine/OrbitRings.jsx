// Elliptical orbit rings + atmospheric glow centered on the orb.
// Rings scale with the central orb via the `--orb-size` CSS variable,
// so the whole orbital system stays proportional at every breakpoint.
// Each ring is a circle squished with scaleY to read as a tilted orbit plane.

const rings = [
  { mult: 1.45, cls: "border border-primary/15" },
  { mult: 1.85, cls: "border border-dashed border-secondary/25", spin: true, duration: "34s" },
  { mult: 2.15, cls: "border border-white/50" }
];

export default function OrbitRings({ center = { x: 50, y: 50 } }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* Strongest glow directly behind the sphere */}
      <div
        className="absolute aspect-square rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.32),rgba(37,99,235,0.16),transparent_68%)] blur-2xl"
        style={{ width: "calc(var(--orb-size) * 2.6)", left: `${center.x}%`, top: `${center.y}%`, transform: "translate(-50%,-50%)" }}
      />

      {rings.map((r) => (
        <div
          key={r.mult}
          className="absolute aspect-square"
          style={{ width: `calc(var(--orb-size) * ${r.mult})`, left: `${center.x}%`, top: `${center.y}%`, transform: "translate(-50%,-50%)" }}
        >
          <div className="h-full w-full [transform:scaleY(0.62)]">
            <div
              className={`h-full w-full rounded-full ${r.cls} ${r.spin ? "animate-spin-slow" : ""}`}
              style={r.spin ? { animationDuration: r.duration } : undefined}
            >
              {r.spin && (
                <>
                  <span className="absolute -top-[2px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-indigo-300/80 shadow-[0_0_8px_rgba(129,140,248,0.9)]" />
                  <span className="absolute top-1/2 -left-[2px] h-[4px] w-[4px] -translate-y-1/2 rounded-full bg-purple-300/70 shadow-[0_0_8px_rgba(168,85,247,0.9)]" />
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Tiny orbiting particles on the dashed ring */}
      <div
        className="absolute aspect-square"
        style={{ width: "calc(var(--orb-size) * 1.85)", left: `${center.x}%`, top: `${center.y}%`, transform: "translate(-50%,-50%)" }}
      >
        <div className="h-full w-full [transform:scaleY(0.62)]">
          <div className="h-full w-full animate-spin-slow [animation-direction:reverse] [animation-duration:40s]">
            <span className="absolute -top-[3px] left-[38%] h-[6px] w-[6px] rounded-full bg-gradient-to-br from-purple-400 to-blue-400 shadow-[0_0_10px_rgba(139,92,246,0.9)]" />
            <span className="absolute right-[6%] top-[38%] h-[4px] w-[4px] rounded-full bg-blue-300/80 shadow-[0_0_8px_rgba(96,165,250,0.9)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
