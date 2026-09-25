import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { gzipSync } from "node:zlib";

const root = resolve("dist");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".json": "application/json",
  ".txt": "text/plain",
};
const server = createServer(async (req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
  } catch {
    res.writeHead(400).end();
    return;
  }
  const target = resolve(root, `.${pathname}`);
  if (target !== root && !target.startsWith(root + sep)) {
    res.writeHead(403).end();
    return;
  }
  let data, file;
  for (const candidate of [
    target,
    `${target}.html`,
    resolve(target, "index.html"),
  ]) {
    try {
      data = await readFile(candidate);
      file = candidate;
      break;
    } catch {
      /* Try clean URL or directory index. */
    }
  }
  if (!data) {
    data = await readFile(resolve(root, "404.html"));
    file = "404.html";
    res.statusCode = 404;
  }
  const extension = extname(file);
  res.setHeader("Content-Type", mime[extension] || "application/octet-stream");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Cache-Control",
    [".html", ".xml", ".txt"].includes(extension)
      ? "no-cache"
      : "public, max-age=604800",
  );
  if (
    /gzip/.test(req.headers["accept-encoding"] || "") &&
    [".html", ".css", ".js", ".svg", ".xml"].includes(extension)
  ) {
    data = gzipSync(data);
    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Vary", "Accept-Encoding");
  }
  res.setHeader("Content-Length", data.length);
  res.end(req.method === "HEAD" ? undefined : data);
});
server.listen(Number(process.env.PORT || 5174), "127.0.0.1", () =>
  console.log(
    `Portfolio preview: http://127.0.0.1:${process.env.PORT || 5174}`,
  ),
);
