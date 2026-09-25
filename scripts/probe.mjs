// Exploratory measurements against a running production preview (npm run preview).
//   node scripts/probe.mjs routes              status, console errors and overflow on every route
//   node scripts/probe.mjs wheel [--gpu]       chapters advanced per replayed wheel gesture
//   node scripts/probe.mjs shader [--gpu] [--cpu=4]   draws and long tasks 6–9 s after load
// --gpu uses the machine's GPU instead of software WebGL (SwiftShader).
import { chromium, devices } from "playwright";
import { pageInfo } from "../.server/entry-server.js";

const base = "http://127.0.0.1:5174";
const [command, ...flags] = process.argv.slice(2);
const cpu = Number(flags.find((f) => f.startsWith("--cpu="))?.slice(6) || 1);
const args = flags.includes("--gpu")
  ? ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"]
  : [];
const browser = await chromium.launch({ args });
const momentum = (start, decay, events) =>
  Array.from({ length: events }, (_, t) => start * decay ** t);

async function routes() {
  let failed = false;
  for (const [name, options] of [
    ["desktop", { viewport: { width: 1440, height: 900 } }],
    ["mobile", devices["Pixel 5"]],
  ])
    for (const colorScheme of ["light", "dark"]) {
      const page = await browser.newPage({ ...options, colorScheme });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      for (const path of [...Object.keys(pageInfo), "/not-a-page"]) {
        const status = (await page.goto(base + path)).status();
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        );
        const expected = path === "/not-a-page" ? 404 : 200;
        // The 404 route logs its own failed document request; nothing else may.
        const unexpected = errors.splice(0).filter((e) => !(expected === 404 && /404/.test(e)));
        const ok = status === expected && !overflow && !unexpected.length;
        failed ||= !ok;
        if (!ok) console.log(name, colorScheme, path, { status, overflow, unexpected });
      }
      await page.close();
    }
  console.log(failed ? "Route sweep: FAILED" : "Route sweep: all routes passed");
  if (failed) process.exitCode = 1;
}

async function wheel() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const [name, deltas] of [
    ["strong trackpad flick", momentum(80, 0.96, 120)],
    ["gentle trackpad flick", momentum(40, 0.95, 90)],
    ["Magic Mouse momentum", momentum(120, 0.97, 150)],
    ["Windows mouse notch", [100]],
  ]) {
    await page.goto(base + "/");
    await page.locator(".shader-background").waitFor({ state: "attached" });
    const advances = await page.evaluate(async (deltas) => {
      const gallery = document.querySelector(".gallery");
      const chapter = () =>
        document.querySelector('[role="progressbar"]').getAttribute("aria-valuenow");
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
      let previous = chapter(), changes = 0;
      const count = () => chapter() !== previous && (changes++, (previous = chapter()));
      const start = performance.now();
      // One event per 16 ms of real time, as in tests/helpers.ts.
      for (const [i, deltaY] of deltas.entries()) {
        await wait(start + i * 16 - performance.now());
        gallery.dispatchEvent(new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true }));
        await Promise.resolve();
        count();
      }
      await wait(400);
      count();
      return changes;
    }, deltas);
    console.log(`${name.padEnd(24)} ${advances} chapter(s)`);
  }
}

async function shader() {
  const page = await browser.newPage({ viewport: { width: 412, height: 823 } });
  if (cpu > 1)
    await (await page.context().newCDPSession(page)).send(
      "Emulation.setCPUThrottlingRate",
      { rate: cpu },
    );
  await page.goto(base + "/");
  await page.locator(".shader-background canvas").waitFor({ state: "attached" });
  await page.waitForTimeout(6000);
  const result = await page.evaluate(async () => {
    const gl = document.querySelector(".shader-background canvas").getContext("webgl2");
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    let draws = 0, longTasks = 0;
    const draw = gl.drawArrays.bind(gl);
    gl.drawArrays = (...a) => (draws++, draw(...a));
    const observer = new PerformanceObserver((l) => (longTasks += l.getEntries().length));
    observer.observe({ type: "longtask" });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    observer.disconnect();
    return { renderer: gl.getParameter(info.UNMASKED_RENDERER_WEBGL), draws, longTasks };
  });
  console.log(
    `${result.renderer.slice(0, 48)} · CPU ${cpu}× · ${result.draws} draws (${(result.draws / 3).toFixed(1)} fps), ${result.longTasks} long tasks in 6–9 s`,
  );
}

try {
  if (command === "routes") await routes();
  else if (command === "wheel") await wheel();
  else if (command === "shader") await shader();
  else console.log("Usage: node scripts/probe.mjs routes|wheel|shader [--gpu] [--cpu=4]");
} finally {
  await browser.close();
}
