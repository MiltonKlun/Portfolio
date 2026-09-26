// Regenerates public/images/social-preview.png (the og:image) from the landing page.
// Run against a production preview (npm run build && npm run preview), then bump the
// ?v= value on og:image in index.html so link-preview caches fetch the new image.
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
  colorScheme: "dark",
  reducedMotion: "reduce",
});
await page.goto("http://127.0.0.1:5174/");
await page.locator(".shader-background canvas").waitFor({ state: "attached" });
await page.evaluate(() => document.fonts.ready);
// Keep the wordmark and first chapter's copy; hide interactive chrome.
await page.addStyleTag({
  content:
    ".icon-button,.header-balance,.chapter-footer,.scene-actions,.skip-link{visibility:hidden!important}",
});
// Centre the visible copy in the space below the header.
await page.evaluate(() => {
  const copy = document.querySelector(".scene.is-active .scene-copy");
  const boxes = [...copy.children]
    .filter((e) => getComputedStyle(e).visibility !== "hidden")
    .map((e) => e.getBoundingClientRect());
  const top = Math.min(...boxes.map((r) => r.top));
  const bottom = Math.max(...boxes.map((r) => r.bottom));
  const header = document.querySelector(".site-header").getBoundingClientRect().bottom;
  const target = header + (innerHeight - header - (bottom - top)) / 2;
  copy.style.translate = `0 ${Math.round(target - top)}px`;
});
await page.waitForTimeout(1000);
await page.screenshot({ path: "public/images/social-preview.png" });
await browser.close();
console.log("Wrote public/images/social-preview.png (1200×630).");
