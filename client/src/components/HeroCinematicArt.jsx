// "Digital Universe of Innovation" — a CSS/SVG stand-in for the cinematic 3D
// render described in design brief (see docs/about-hero-image-prompt.md for
// the AI-image-generator prompt). Pure shapes, no text/logo/people, so it's
// safe to sit behind a heading. All motion re-uses existing keyframes from
// index.css (spin-slow, dashflow, node-pulse, float-soft, orb-float) so nothing
// new is added to the animation budget.
//
// Layout contract: the artwork concentrates on the RIGHT ~55% of its parent;
// the left gradient overlay keeps the left ~45% solid and clean for heading
// and breadcrumb text, regardless of viewport width.
export default function HeroCinematicArt({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Deep black-purple backdrop, glow concentrated on the right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 80% at 82% 45%, rgba(114,0,245,0.35) 0%, rgba(32,72,245,0.18) 35%, rgba(10,6,20,0) 70%)"
        }}
      />

      {/* Floating translucent glass shapes */}
      <div className="absolute right-[6%] top-[14%] h-28 w-28 animate-float-soft rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-primary/10 backdrop-blur-xl [animation-delay:0.5s]" style={{ transform: "rotate(18deg)" }} />
      <div className="absolute right-[26%] top-[62%] h-20 w-20 animate-orb-float rounded-full border border-white/10 bg-gradient-to-br from-secondary/20 to-white/5 backdrop-blur-xl" />
      <div className="absolute right-[2%] bottom-[10%] h-36 w-24 animate-float-soft rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-primary/15 to-secondary/10 backdrop-blur-xl [animation-delay:1.2s]" style={{ transform: "rotate(-12deg)" }} />

      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute right-0 top-0 h-full w-[70%]"
      >
        <defs>
          <linearGradient id="hca-facet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A00F5" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2048F5" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="hca-trail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A00F5" stopOpacity="0" />
            <stop offset="50%" stopColor="#C9A6FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2048F5" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hca-ring" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7200F5" stopOpacity="0" />
            <stop offset="50%" stopColor="#9B5CFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2048F5" stopOpacity="0" />
          </linearGradient>
          <filter id="hca-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Orbital rings around the sculpture, each slowly rotating about its own center */}
        <g className="animate-spin-slow" style={{ transformOrigin: "420px 300px" }}>
          <ellipse cx="420" cy="300" rx="230" ry="90" fill="none" stroke="url(#hca-ring)" strokeWidth="1.5" transform="rotate(-18 420 300)" />
        </g>
        <g className="animate-spin-slow" style={{ transformOrigin: "420px 300px", animationDirection: "reverse", animationDuration: "34s" }}>
          <ellipse cx="420" cy="300" rx="190" ry="130" fill="none" stroke="url(#hca-ring)" strokeWidth="1" opacity="0.7" transform="rotate(24 420 300)" />
        </g>
        <g className="animate-spin-slow" style={{ transformOrigin: "420px 300px", animationDuration: "42s" }}>
          <ellipse cx="420" cy="300" rx="270" ry="60" fill="none" stroke="url(#hca-ring)" strokeWidth="1" opacity="0.5" transform="rotate(8 420 300)" />
        </g>

        {/* Abstract faceted glass sculpture */}
        <g opacity="0.9">
          <polygon points="420,120 520,230 460,340 380,300" fill="url(#hca-facet)" stroke="#C9A6FF" strokeOpacity="0.25" strokeWidth="1" />
          <polygon points="460,340 520,230 580,320 500,420" fill="url(#hca-facet)" stroke="#C9A6FF" strokeOpacity="0.2" strokeWidth="1" />
          <polygon points="380,300 460,340 500,420 400,440 340,380" fill="url(#hca-facet)" stroke="#C9A6FF" strokeOpacity="0.2" strokeWidth="1" />
          <polygon points="420,120 380,300 320,250 350,160" fill="url(#hca-facet)" stroke="#C9A6FF" strokeOpacity="0.15" strokeWidth="1" />
          <polyline points="420,120 520,230 580,320" fill="none" stroke="#E7D6FF" strokeOpacity="0.4" strokeWidth="1.25" />
        </g>

        {/* Glowing energy trails */}
        <path
          d="M80,120 C220,80 300,180 380,160 C470,140 520,60 640,90"
          fill="none"
          stroke="url(#hca-trail)"
          strokeWidth="2.5"
          filter="url(#hca-glow)"
          strokeDasharray="100"
          className="animate-dashflow"
        />
        <path
          d="M160,480 C280,440 340,500 440,460 C540,420 560,500 680,470"
          fill="none"
          stroke="url(#hca-trail)"
          strokeWidth="2"
          filter="url(#hca-glow)"
          strokeDasharray="100"
          className="animate-dashflow"
          style={{ animationDuration: "7s", animationDirection: "reverse" }}
        />

        {/* Subtle digital particles */}
        {[
          [160, 100], [250, 420], [560, 150], [650, 350], [340, 520],
          [600, 460], [500, 90], [230, 260], [700, 200], [120, 340]
        ].map(([x, y], i) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={1.5 + (i % 3)}
            fill="#C9A6FF"
            className="animate-node-pulse"
            style={{ animationDelay: `${(i % 5) * 0.4}s`, transformOrigin: `${x}px ${y}px` }}
          />
        ))}
      </svg>

      {/* Hard guarantee: left side stays solid and clean for heading/breadcrumb text */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, #0A0612 0%, #0A0612 40%, rgba(10,6,18,0.85) 50%, rgba(10,6,18,0) 65%)" }}
      />
    </div>
  );
}
