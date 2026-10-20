import { useState } from "react";
import { FaPaperPlane, FaCircleCheck } from "react-icons/fa6";
import { API_URL } from "../config/site";

export default function Newsletter({ light = false }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");

  const submit = async (e) => {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch(`${API_URL}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-green-600">
        <FaCircleCheck /> You're subscribed. Welcome aboard!
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      <div className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        aria-label="Email address"
        className={
          light
            ? "w-full rounded-full border border-line bg-white px-5 py-3 text-sm text-ink placeholder-muted/70 outline-none transition-colors focus:border-primary/40"
            : "w-full rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/50 outline-none transition-colors focus:border-white/40 backdrop-blur"
        }
      />
      <button type="submit" disabled={state === "loading"} className="btn-primary !px-5" aria-label="Subscribe">
        <FaPaperPlane className="h-4 w-4" />
      </button>
      </div>
      {state === "error" && (
        <p className={`mt-2 text-xs ${light ? "text-red-600" : "text-white"}`} role="alert">Couldn't subscribe right now. Please try again.</p>
      )}
    </form>
  );
}