import { FaArrowTrendUp } from "react-icons/fa6";

export default function GrowthCard({ label, value, sub, compact = false, className = "" }) {
  return (
    <div className={`animate-float-soft relative rounded-[20px] border border-white/20 bg-primary-gradient p-3.5 shadow-glow sm:p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15 text-emerald-300 backdrop-blur-sm sm:h-10 sm:w-10">
          <FaArrowTrendUp className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-[10px]">{label}</p>
          <p className="font-display text-xl font-extrabold leading-none text-white sm:text-2xl">{value}</p>
        </div>
      </div>
      {!compact && <p className="mt-2 text-[11px] leading-snug text-white/75">{sub}</p>}
    </div>
  );
}
