import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import logoFull from "../assets/logo-full.png";

// Official brand mark (src/assets/logo.png) beside the company wordmark.
// The mark is always rendered at its native 1:1 ratio — never stretched or recoloured.
export default function Logo({ dark = false, full = false, className = "" }) {
  if (full) {
    return (
      <Link to="/" className={`group flex shrink-0 items-center ${className}`} aria-label="Skyntrix Technologies home">
        <img
          src={logoFull}
          alt="Skyntrix Technologies"
          width="1435"
          height="348"
          className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-11"
        />
      </Link>
    );
  }

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
        <span className={`block text-[10px] font-bold uppercase tracking-[0.22em] ${dark ? "text-secondary-100" : "text-secondary"}`}>
          Technologies
        </span>
      </span>
    </Link>
  );
}
