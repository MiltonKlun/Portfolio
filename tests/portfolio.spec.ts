import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { projects } from "../src/content";

test("portrait and credentials have accessible, working source links", async ({ page, request }) => {
  await page.goto("/about");
  const portrait = page.getByRole("img", { name: "Milton Klun", exact: true });
  await expect(portrait).toBeVisible();
  expect(await portrait.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
  await expect(page.locator(".page-intro .eyebrow")).toHaveText("About · Milton Klun");
  await page.goto("/skills");
  const credentials = page.getByRole("region", { name: "What I’ve been learning." });
  await expect(credentials.locator(".credential-card")).toHaveCount(12);
  await expect(credentials.getByRole("link", { name: /^Verify / })).toHaveCount(4);
  await expect(credentials.getByRole("link", { name: "Verify English · C1 Advanced (opens in new tab)" })).toHaveAttribute("href", "https://cert.efset.org/en/g93sqo");
  for (const link of await credentials.locator('a[href^="/credentials/"]').all()) {
    const response = await request.get((await link.getAttribute("href"))!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toMatch(/application\/pdf|image\//);
    await expect(link).toHaveAttribute("target", "_blank");
  }
  for (const preview of await credentials.locator("img").all()) {
    expect((await request.get((await preview.getAttribute("src"))!)).status()).toBe(200);
  }
  await credentials.getByRole("link", { name: /View Building Reliable Agents certificate/ }).focus();
  await expect(credentials.getByRole("link", { name: /View Building Reliable Agents certificate/ })).toBeFocused();
  for (const theme of ["dark", "light"]) {
    await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    expect((await new AxeBuilder({ page }).include(".credentials").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  }
});

test("landing shaders remain static with reduced motion and release on navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".shader-background canvas")).toHaveCount(1, {
    timeout: 10000,
  });
  expect(await page.locator("canvas").evaluate(canvas => (canvas as HTMLCanvasElement).width >= canvas.clientWidth)).toBeTruthy();
  const still = await page.locator("canvas").screenshot();
  await page.waitForTimeout(300);
  expect(await page.locator("canvas").screenshot()).toEqual(still);
  await expect(page.locator(".gallery img,.chapter-meta")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Search portfolio" }),
  ).toHaveCount(0);
  for (let i = 0; i < 5; i++) {
    await expect(page.locator(".shader-background")).toHaveAttribute(
      "data-composition",
      String(i),
    );
    await expect(page.locator("canvas")).toHaveCount(1);
    if (i < 4) await page.keyboard.press("ArrowRight");
  }
  await expect(
    page.getByRole("link", { name: "Let's talk", exact: true }),
  ).toBeVisible();
  await page
    .locator("canvas")
    .evaluate((canvas) =>
      canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
    );
  await expect(page.locator("canvas")).toHaveCSS("opacity", "0");
  await page.getByRole("link", { name: "Let's talk", exact: true }).click();
  await expect(page).toHaveURL("/contact");
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("five-section menu, icon-only CV access, and persistent themes", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuemax",
    "5",
  );
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("navigation", { name: "Main navigation" });
  await expect(menu.getByRole("link")).toHaveText([
    "About me↗",
    "Experience↗",
    "Projects↗",
    "Skills↗",
    "Contact↗",
  ]);
  await expect(menu.getByRole("button")).toHaveCount(0);
  const toggle = page.getByRole("switch", { name: "Dark theme" });
  await expect(toggle).not.toBeChecked();
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toBeChecked();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "View CV", exact: true })
    .click();
  await expect(page).toHaveURL("/cv");
  await expect(page.getByText("Experience at a glance")).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(toggle).toBeChecked();
  await toggle.click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("dark theme remains accessible across editorial pages and menu", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  for (const route of [
    "/about",
    "/experience",
    "/work",
    "/skills",
  ]) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations, route).toEqual([]);
  }
  await page.getByRole("button", { name: "Open menu" }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("identity, chapter click, keyboard, progress, and history", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Quality,",
  );
  await page.getByRole("button", { name: "Next chapter", exact: true }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "2",
  );
  await expect(
    page.getByRole("heading", { name: "Work with impact." }),
  ).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "3",
  );
  await page.keyboard.press("Home");
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "1",
  );
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(page).toHaveURL("/work");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "What I’m building.",
  );
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Quality,",
  );
});

test("wheel advances exactly one chapter and wraps", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Touch journey is covered separately.");
  await page.goto("/");
  await page.mouse.move(700, 400);
  await page.mouse.wheel(0, 600);
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "2",
  );
  await page.waitForTimeout(1000);
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "2",
  );
  await page.keyboard.press("End");
  await page.getByRole("button", { name: "Next chapter", exact: true }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "1",
  );
  await page.waitForTimeout(1050);
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "1",
  );
});

test("menu focus, Escape, and direct CV download", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 16; i++) await page.keyboard.press("Tab");
  expect(
    await dialog.evaluate((e) => e.contains(document.activeElement)),
  ).toBeTruthy();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  await page.goto("/cv");
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download CV" }).click();
  expect((await download).suggestedFilename()).toBe("Milton_Klun_CV.pdf");
});

test("routes have readable content, correct metadata, and no overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "/about",
    "/experience",
    "/skills",
    "/contact",
    "/work",
    "/cv",
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://miltonklun.com${route}`,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
  expect(errors).toEqual([]);
});

test("reduced motion keeps chapters, menu, and project content accessible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("heading", { name: "Work with impact." }),
  ).toBeVisible();
  expect(
    await page
      .locator(".chapter-track")
      .evaluate((e) => getComputedStyle(e).transitionDuration),
  ).toBe("0s");
  await page.getByRole("link", { name: "View experience" }).click();
  await expect(page).toHaveURL("/experience");
  await expect(
    page.getByRole("heading", { name: "Quality in practice.", exact: true }),
  ).toBeAttached();
});

test("WCAG checks cover chapters, menu, case study, contact, and skills", async ({
  page,
}) => {
  for (const route of ["/", "/work", "/contact", "/skills"]) {
    await page.goto(route);
    await page.waitForTimeout(800);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations,
      `${route}: ${JSON.stringify(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
  }
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(600);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("static HTML includes primary evidence without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/work`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "What I’m building.",
  );
  await expect(page.getByRole("link", { name: /Evalstand/ })).toHaveAttribute(
    "href",
    "https://github.com/MiltonKlun/Evalstand",
  );
  await context.close();
});

test("footer selection centers the chapter before opening it", async ({
  page,
}) => {
  await page.goto("/");
  const neighbor = page.getByRole("link", {
    name: "Show Experience",
    exact: true,
  });
  await neighbor.click();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "2",
  );
  await page
    .getByRole("link", { name: "Open Experience", exact: true })
    .click();
  await expect(page).toHaveURL("/experience");
});

test("touch swipe advances the scene", async ({ page, context, isMobile, browserName }) => {
  test.skip(!isMobile, "Mobile touch gesture.");
  test.skip(browserName !== "chromium", "Uses a Chromium-only CDP touch session.");
  await page.goto("/");
  const session = await context.newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 280, y: 590 }],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: 180, y: 590 }],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "2",
  );
});

test("removed routes and unknown paths return 404", async ({ request }) => {
  for (const route of [
    "/qa-lab",
    "/tested",
    "/untested",
    "/capabilities",
    "/a-page-that-does-not-exist",
  ]) {
    const response = await request.get(route);
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain("An unexpected path.");
  }
});

test("@visual gallery and editorial layout", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.waitForTimeout(350);
  await expect(page).toHaveScreenshot("home.png", { animations: "disabled" });
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(350);
  await expect(page).toHaveScreenshot("experience-chapter.png", {
    animations: "disabled",
  });
  await page.goto("/work");
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot("projects.png", {
    animations: "disabled",
  });
});


test("clean menu and aligned quotation footer", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu.getByText("miltonericklun@gmail.com", { exact: true })).toHaveCount(0);
  await expect(menu.getByText(/Bah?a Blanca/)).toHaveCount(0);
  await expect(menu.getByRole("link", { name: "Email Milton" })).toBeVisible();
  await page.keyboard.press("Escape");
  for (const route of ["/about", "/work"]) {
    await page.goto(route);
    const footer = page.locator(".page-footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.getByText("Quality is not an act, it is a habit")).toBeVisible();
    await expect(footer.locator("em")).toHaveCSS("font-style", "italic");
    if (page.viewportSize()!.width > 600) {
      const boxes = await footer.locator(":scope > *").evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return r.y + r.height / 2; }));
      expect(Math.max(...boxes) - Math.min(...boxes)).toBeLessThan(2);
    }
  }
});

test("projects link to their GitHub repositories, and old project pages redirect there", async ({
  page,
  request,
}) => {
  await page.goto("/work");
  const cards = page.locator(".work-item");
  await expect(cards).toHaveCount(projects.length);
  for (const [i, project] of projects.entries()) {
    await expect(cards.nth(i)).toHaveAttribute("href", project.repo);
    await expect(cards.nth(i)).toHaveAccessibleName(/source code on GitHub/);
  }
  await page.goto("/skills");
  for (const link of await page.locator(".skills .text-link").all())
    expect(projects.map((p) => p.repo)).toContain(await link.getAttribute("href"));
  // Hosting redirects and project data must name the same repositories.
  const { redirects } = JSON.parse(readFileSync("vercel.json", "utf8"));
  expect(redirects).toEqual(
    projects.map((p) => ({
      source: `/work/${p.slug}`,
      destination: p.repo,
      permanent: true,
    })),
  );
  for (const project of projects) {
    const response = await request.get(`/work/${project.slug}`, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(project.repo);
  }
});

test("site icons are declared and served with the right types", async ({ page, request }) => {
  await page.goto("/");
  const icons = page.locator('link[rel="icon"], link[rel="apple-touch-icon"]');
  await expect(icons).toHaveCount(3);
  for (const href of await icons.evaluateAll((links) => links.map((l) => l.getAttribute("href")!))) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
    expect(response.headers()["content-type"], href).toMatch(/image\/(svg\+xml|x-icon|png)/);
  }
});
