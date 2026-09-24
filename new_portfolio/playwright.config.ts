import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:5174",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.015 } },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
    {
      name: "tablet",
      use: { viewport: { width: 768, height: 1024 }, hasTouch: true },
    },
    { name: "wide", use: { viewport: { width: 1920, height: 1080 } } },
    // Opt-in engines until they join CI (IMPROVEMENTS.md 4.4). Baselines are Chromium-only.
    ...(process.env.CROSS_BROWSER
      ? [
          {
            name: "firefox",
            grepInvert: /@visual/,
            use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } },
          },
          {
            name: "webkit",
            grepInvert: /@visual/,
            use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } },
          },
          { name: "webkit-mobile", grepInvert: /@visual/, use: { ...devices["iPhone 14"] } },
        ]
      : []),
  ],
  webServer: {
    command: "npm run preview",
    url: "http://127.0.0.1:5174",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
