import { chromium } from "playwright";
import lighthouse from "lighthouse";
import { mkdir, writeFile } from "node:fs/promises";

await mkdir("reports", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--remote-debugging-port=9223"],
});
let failed = false;
try {
  for (const [path, name] of [
    ["/", "home"],
    ["/work", "work"],
    ["/contact", "contact"],
  ]) {
    const result = await lighthouse(`http://127.0.0.1:5174${path}`, {
      port: 9223,
      output: ["html", "json"],
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    });
    await writeFile(`reports/${name}.html`, result.report[0]);
    await writeFile(`reports/${name}.json`, result.report[1]);
    const scores = Object.fromEntries(
      Object.entries(result.lhr.categories).map(([key, value]) => [
        key,
        Math.round(value.score * 100),
      ]),
    );
    console.log(
      name,
      scores,
      "LCP",
      result.lhr.audits["largest-contentful-paint"].displayValue,
    );
    for (const [key, minimum] of Object.entries({
      performance: 90,
      accessibility: 95,
      "best-practices": 95,
      seo: 95,
    })) {
      if (scores[key] < minimum) {
        failed = true;
        console.error(`${name}: ${key} below ${minimum}`);
      }
    }
  }
} finally {
  await browser.close();
}
if (failed) process.exitCode = 1;
