import { FaCheck, FaCode, FaMobileScreenButton, FaBolt, FaChartLine } from "react-icons/fa6";
import logo from "../assets/logo.png";

// Illustrative product composition for the homepage hero. Built entirely from
// CSS/markup (no stock imagery) and purely decorative, so it is hidden from
// assistive tech. Progress values are UI decoration, not business metrics.

const modules = [
  { name: "Web app", status: "Live", value: 100 },
  { name: "Mobile app", status: "Building", value: 72 },
  { name: "Admin panel", status: "Design", value: 45 }
];

const bars = [38, 52, 44, 66, 58, 74, 62, 82, 70, 88, 78, 94];

const tasks = [
  { label: "UI design approved", done: true },
  { label: "API integration", done: true },
  { label: "Launch checklist", done: false }
];

function FloatCard({ icon: Ico, title, sub, className = "", delay = "0s", children }) {
  return (
    <div
      className={`absolute z-20 hidden w-max min-w-[176px] animate-float-soft rounded-2xl border border-white/80 bg-white/85 p-3 shadow-elevated backdrop-blur-xl sm:block ${className}`}
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
      {children}
    </div>
  );
}

export default function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[640px] px-0 py-4 sm:px-10 sm:py-12 lg:px-8" aria-hidden="true">
      {/* Ambient light */}
      <div className="pointer-events-none absolute left-[8%] top-[6%] h-64 w-64 rounded-full bg-primary/20 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-[4%] right-[4%] h-64 w-64 rounded-full bg-secondary/20 blur-[90px]" />

      {/* Geometric accents echoing the logo's dots */}
      <span className="absolute right-[9%] top-[3%] hidden h-3 w-3 rounded-full bg-primary-gradient sm:block" />
      <span className="absolute right-[4%] top-[11%] hidden h-1.5 w-1.5 rounded-full bg-secondary sm:block" />
      <span className="absolute bottom-[2%] left-[16%] hidden h-16 w-16 rounded-full border border-dashed border-primary/25 animate-spin-slow sm:block" />

      {/* Browser window */}
      <div className="relative z-10 lg:[transform:perspective(1800px)_rotateY(-8deg)_rotateX(3deg)]">
        <div className="overflow-hidden rounded-2xl border border-white bg-white shadow-[0_2px_4px_rgba(23,18,31,0.04),0_40px_80px_-30px_rgba(72,24,160,0.38)] ring-1 ring-line">
          {/* Chrome */}
          <div className="flex items-center gap-3 border-b border-line bg-lavender/70 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            </div>
            <div className="mx-auto flex h-6 w-full max-w-[240px] items-center justify-center rounded-md bg-white text-[10px] text-muted ring-1 ring-line">
              your-business.app/dashboard
            </div>
            <span className="w-8" />
          </div>

          {/* App */}
          <div className="flex">
            {/* Sidebar */}
            <div className="hidden w-[118px] shrink-0 flex-col gap-1.5 border-r border-line bg-white p-3 sm:flex">
              <div className="mb-2 flex items-center gap-1.5">
                <img src={logo} alt="" width="18" height="18" className="h-[18px] w-[18px]" />
                <span className="h-2 w-12 rounded-full bg-ink/15" />
              </div>
              {["w-16", "w-12", "w-14", "w-10", "w-12"].map((w, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${i === 0 ? "bg-lavender" : ""}`}
                >
                  <span className={`h-2.5 w-2.5 rounded ${i === 0 ? "bg-primary" : "bg-ink/15"}`} />
                  <span className={`h-1.5 rounded-full ${w} ${i === 0 ? "bg-primary/40" : "bg-ink/10"}`} />
                </div>
              ))}
            </div>

            {/* Main */}
            <div className="min-w-0 flex-1 space-y-3 bg-gradient-to-b from-white to-lavender/50 p-3.5 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-bold text-ink">Project overview</p>
                  <p className="text-[10px] text-muted">Sprint board · this week</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> On track
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {modules.map((m) => (
                  <div key={m.name} className="rounded-xl border border-line bg-white p-2.5">
                    <p className="truncate text-[10px] font-semibold text-ink">{m.name}</p>
                    <p className="text-[9px] text-muted">{m.status}</p>
                    <div className="mt-2 h-1.5 rounded-full bg-lavender">
                      <div className="h-1.5 rounded-full bg-primary-gradient" style={{ width: `${m.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-3 rounded-xl border border-line bg-white p-2.5">
                  <p className="text-[10px] font-semibold text-ink">Weekly activity</p>
                  <div className="mt-2 flex h-20 items-end gap-1">
                    {bars.map((h, i) => (
                      <span
                        key={i}
                        className="flex-1 rounded-t-[3px] bg-gradient-to-t from-primary/70 to-secondary/80"
                        style={{ height: `${h}%`, opacity: 0.45 + (i / bars.length) * 0.55 }}
                      />
                    ))}
                  </div>
                </div>
                <div className="col-span-2 space-y-1.5 rounded-xl border border-line bg-white p-2.5">
                  <p className="text-[10px] font-semibold text-ink">Milestones</p>
                  {tasks.map((t) => (
                    <div key={t.label} className="flex items-center gap-1.5">
                      <span
                        className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full ${
                          t.done ? "bg-primary text-white" : "border border-primary/30"
                        }`}
                      >
                        {t.done && <FaCheck className="h-2 w-2" />}
                      </span>
                      <span className={`truncate text-[9.5px] ${t.done ? "text-ink/70" : "text-muted"}`}>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating capability cards (tablet and up) */}
      <FloatCard icon={FaCode} title="Web Development" sub="Responsive & SEO-ready" className="-left-1 top-0 lg:-left-6" />
      <FloatCard icon={FaMobileScreenButton} title="Mobile Apps" sub="iOS & Android" className="-right-1 top-[44%] lg:-right-8" delay="1.2s" />
      <FloatCard icon={FaBolt} title="Business Automation" sub="Workflows & dashboards" className="-left-1 bottom-[6%] lg:-left-10" delay="2.4s" />
      <FloatCard icon={FaChartLine} title="Project Analytics" sub="Clear progress tracking" className="-bottom-4 right-[10%]" delay="0.6s">
        <svg viewBox="0 0 160 32" className="mt-2 h-7 w-full" fill="none">
          <defs>
            <linearGradient id="hv-spark" x1="0" x2="1">
              <stop offset="0" stopColor="#7200F5" />
              <stop offset="1" stopColor="#2048F5" />
            </linearGradient>
          </defs>
          <path d="M2 26 L24 20 L44 23 L66 14 L88 17 L110 9 L132 12 L158 4" stroke="url(#hv-spark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </FloatCard>
    </div>
  );
}
