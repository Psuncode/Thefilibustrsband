import { defineConfig, devices } from "@playwright/test";

const port = 4323;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }], ["list"]],
  use: {
    baseURL,
    viewport: { width: 375, height: 812 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    {
      name: "chromium-mobile",
      use: { ...devices["iPhone 13"], viewport: { width: 375, height: 812 } }
    }
  ],
  webServer: {
    command: `npm run dev -- --port ${port} --host 127.0.0.1`,
    url: baseURL,
    timeout: 60_000,
    reuseExistingServer: !process.env.CI
  }
});
