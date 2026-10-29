// Playwright config for the admin-portal E2E suite (domain-migration regression).
//
// This does NOT auto-start the app: the client (Vite) and server (Express)
// workspaces have their own dev/start scripts and env files, and the server
// needs a running local MongoDB. Start both yourself before running tests,
// pointing PLAYWRIGHT_BASE_URL at whichever origin you started the client on.
// See tests/e2e/README.md for the exact commands used to produce the results
// in the domain-migration report.
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./tests/e2e/.output/test-results",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 60_000,
  reporter: [
    ["list"],
    ["html", { outputFolder: "./tests/e2e/.output/html-report", open: "never" }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
