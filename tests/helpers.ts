import { expect, type Page } from "@playwright/test";

// Set SHOW_KNOWN_DEFECTS=1 to run regression tests as ordinary tests and see the real failure.
export const knownDefect = (condition: boolean) =>
  condition && !process.env.SHOW_KNOWN_DEFECTS;

// Decaying wheel deltas, one per display frame, like trackpad or Magic Mouse momentum.
export const momentum = (start: number, decay: number, events: number) =>
  Array.from({ length: events }, (_, t) => start * decay ** t);

export async function waitForGallery(page: Page) {
  await expect(page.locator(".shader-background")).toHaveCount(1, {
    timeout: 10000,
  });
}

// Dispatches wheel events on the gallery every 16 ms of real time (not per
// animation frame, whose rate differs between engines) and returns how many
// chapters changed, including any change that lands after the gesture ends.
export async function replayWheel(page: Page, deltas: number[]) {
  return page.evaluate(async (deltas) => {
    const gallery = document.querySelector(".gallery")!;
    const chapter = () =>
      document
        .querySelector('[role="progressbar"]')!
        .getAttribute("aria-valuenow");
    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
    let previous = chapter();
    let changes = 0;
    const count = () => {
      if (chapter() !== previous) {
        changes++;
        previous = chapter();
      }
    };
    const start = performance.now();
    for (const [i, deltaY] of deltas.entries()) {
      await wait(start + i * 16 - performance.now());
      gallery.dispatchEvent(
        new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true }),
      );
      await Promise.resolve();
      count();
    }
    await wait(400);
    count();
    return changes;
  }, deltas);
}

// Reads the renderer from the shader's own context; a second context can fail under load.
export const glRenderer = (page: Page) =>
  page.evaluate(() => {
    const gl = document
      .querySelector<HTMLCanvasElement>(".shader-background canvas")
      ?.getContext("webgl2");
    const info = gl?.getExtension("WEBGL_debug_renderer_info");
    return info ? String(gl!.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
  });

// Counts shader draw calls and main-thread long tasks during a window.
export async function measureShader(page: Page, ms: number) {
  return page.evaluate(async (ms) => {
    const canvas = document.querySelector<HTMLCanvasElement>(
      ".shader-background canvas",
    );
    const gl = canvas?.getContext("webgl2");
    let draws = 0;
    let longTasks = 0;
    if (gl) {
      const draw = gl.drawArrays.bind(gl);
      gl.drawArrays = (...args) => {
        draws++;
        draw(...args);
      };
    }
    const observer = new PerformanceObserver((list) => {
      longTasks += list.getEntries().length;
    });
    observer.observe({ type: "longtask" });
    await new Promise((resolve) => setTimeout(resolve, ms));
    observer.disconnect();
    return { draws, longTasks };
  }, ms);
}
