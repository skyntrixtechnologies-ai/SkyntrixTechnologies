import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

// StrictMode intentionally double-invokes effects in dev to surface unsafe
// side effects - useful during active debugging, but it double-fires every
// data-fetching effect in this app (duplicate API calls in the server log)
// without a reliable client-side fix: AbortController doesn't help here,
// since a fast local request can complete before the abort signal lands.
// Dev-only; removing it has zero effect on the production build.
createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);