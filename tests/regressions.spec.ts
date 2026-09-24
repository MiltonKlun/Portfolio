import { test, expect } from "@playwright/test";
import {
  glRenderer,
  knownDefect,
  measureShader,
  momentum,
  replayWheel,
  waitForGallery,
} from "./helpers";

// Regression tests for defects found in the 24 September 2026 evaluation.
// Each stays marked as a known defect until its fix lands.

test.describe("wheel gestures", () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(isMobile, "Wheel input is covered on pointer devices.");
    // The shader is irrelevant to gesture handling; keep the main thread quiet.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await waitForGallery(page);
  });

  for (const [name, deltas] of [
    ["strong trackpad flick", momentum(80, 0.96, 120)],
    ["Magic Mouse momentum", momentum(120, 0.97, 150)],
  ] as const) {
    test(`one ${name} advances exactly one chapter`, async ({ page }) => {
      test.fail(knownDefect(true), "Defect C: momentum outlasts the wheel lock.");
      expect(await replayWheel(page, [...deltas])).toBe(1);
    });
  }
});

test("shader settles to a still frame when WebGL is software-rendered", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Long-task timing is Chromium-only.");
  // Today the outcome depends on CPU load: frames here are slow, yet often not
  // slow enough to miss the 180 ms deadline, so it cannot be a stable expected
  // failure. Observed: 45 draws, all 45 long tasks, in the 3 s window.
  test.fixme(knownDefect(true), "Defect B: the slow-frame fallback is load-dependent.");
  // Lighthouse's mobile size.
  await page.setViewportSize({ width: 412, height: 823 });
  await page.goto("/");
  await waitForGallery(page);
  await expect(page.locator(".shader-background canvas")).toHaveCount(1);
  test.skip(
    !(await glRenderer(page)).includes("SwiftShader"),
    "Only meaningful when WebGL falls back to software rendering.",
  );
  test.setTimeout(30000);
  await page.waitForTimeout(6000); // time for the adaptive fallback to settle
  expect(await measureShader(page, 3000)).toEqual({ draws: 0, longTasks: 0 });
});

test("closing a mouse-opened menu returns focus to the menu button", async ({
  page,
  browserName,
}) => {
  test.fail(
    knownDefect(browserName === "webkit"),
    "Defect F: WebKit does not focus buttons on click.",
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});
