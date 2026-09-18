import { readFile, writeFile, mkdir } from "node:fs/promises";
import { render, pageInfo } from "../.server/entry-server.js";

const template = await readFile("dist/index.html", "utf8");
const escape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const routes = [...Object.keys(pageInfo), "/404"];
for (const path of routes) {
  const info = pageInfo[path] || {
    title: "Page not found — Milton Klun",
    description: "Return to Milton Klun’s engineering portfolio.",
  };
  const canonical = `https://miltonklun.com${path}`;
  const structured = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Milton Klun",
    url: "https://miltonklun.com",
    jobTitle: "SDET / QA Automation Engineer",
    knowsAbout: [
      "AI Quality",
      "LLM Evaluation",
      "Test Automation",
      "Python",
      "Playwright",
    ],
    sameAs: [
      "https://github.com/MiltonKlun",
      "https://www.linkedin.com/in/milton-klun/",
    ],
  };
  let html = template
    .replace("<!--app-html-->", render(path))
    .replace(/<title>.*?<\/title>/, `<title>${escape(info.title)}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*/,
      `$1${escape(info.description)}`,
    )
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*/, `$1${canonical}`)
    .replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*/,
      `$1${escape(info.title)}`,
    )
    .replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*/,
      `$1${escape(info.description)}`,
    )
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*/, `$1${canonical}`)
    .replace(
      "<!--page-head-->",
      `${path === "/404" ? '<meta name="robots" content="noindex" />' : ""}<script type="application/ld+json">${JSON.stringify(structured)}</script>`,
    );
  // Static text and links remain usable without JavaScript. The chapter controls enhance this document.
  html = html.replace(
    "</head>",
    "<noscript><style>.navigation-dialog{display:none}.scene:not(.is-active){display:none}.gallery{height:100svh}.chapter-arrow{display:none}</style></noscript></head>",
  );
  if (path === "/404") await writeFile("dist/404.html", html);
  else {
    const dir = path === "/" ? "dist" : `dist${path}`;
    await mkdir(dir, { recursive: true });
    await writeFile(`${dir}/index.html`, html);
    if (path !== "/") await writeFile(`dist${path}.html`, html);
  }
}
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(
    pageInfo,
  )
    .map((path) => `<url><loc>https://miltonklun.com${path}</loc></url>`)
    .join("")}</urlset>`,
);
await writeFile(
  "dist/robots.txt",
  "User-agent: *\nAllow: /\nSitemap: https://miltonklun.com/sitemap.xml\n",
);
console.log(`Prerendered ${routes.length} pages and sitemap.`);
