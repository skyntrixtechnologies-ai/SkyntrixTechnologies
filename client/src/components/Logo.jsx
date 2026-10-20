import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

// Official brand mark (src/assets/logo.png) beside the company wordmark.
// The mark is always rendered at its native 1:1 ratio — never stretched or recoloured.
export default function Logo({ dark = false, className = "" }) {
  return (
    <Link to="/" className={`group flex shrink-0 items-center gap-2.5 ${className}`} aria-label="Skyntrix Technologies home">
      <img
        src={logo}
        alt=""
        width="40"
        height="40"
        className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105"
      />
      <span className="leading-tight">
        <span className={`block font-display text-lg font-extrabold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
          Skyntrix
        </span>
        <span className={`block text-[10px] font-semibold uppercase tracking-[0.22em] ${dark ? "text-white/60" : "text-muted"}`}>
          Technologies
        </span>
      </span>
    </Link>
  );
}
