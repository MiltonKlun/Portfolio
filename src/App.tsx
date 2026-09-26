import { useCallback, useEffect, useRef, useState } from "react";
import { Gallery } from "./Gallery";
import { Header, Navigation, type Overlay } from "./Navigation";
import {
  About,
  Skills,
  Contact,
  CV,
  Experience,
  NotFound,
  Work,
} from "./Pages";
import { pageInfo } from "./content";

export function App({ initialPath = "/" }: { initialPath?: string }) {
  const [path, setPath] = useState(initialPath.replace(/\/$/, "") || "/");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const close = useCallback(() => setOverlay(null), []);
  const gallery = path === "/";

  useEffect(() => {
    const route = (destination: URL, push: boolean) => {
      clearTimeout(timer.current);
      setOverlay(null);
      const nextPath = destination.pathname.replace(/\/$/, "") || "/";
      if (nextPath === path) {
        if (push)
          history.pushState(null, "", destination.pathname + destination.hash);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
        return;
      }
      setLeaving(true);
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      timer.current = setTimeout(
        () => {
          if (push)
            history.pushState(
              null,
              "",
              destination.pathname + destination.hash,
            );
          setPath(nextPath);
          window.scrollTo({ top: 0, behavior: "instant" });
          setLeaving(false);
          requestAnimationFrame(() =>
            document
              .querySelector<HTMLElement>("#main-content")
              ?.focus({ preventScroll: true }),
          );
        },
        reduced ? 0 : 220,
      );
    };
    const click = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (
        !link ||
        link.target ||
        link.hasAttribute("download") ||
        link.hasAttribute("data-full-navigation")
      )
        return;
      const dest = new URL(link.href);
      if (dest.origin !== location.origin || !pageInfo[dest.pathname]) return;
      event.preventDefault();
      route(dest, true);
    };
    const pop = () => route(new URL(location.href), false);
    document.addEventListener("click", click);
    window.addEventListener("popstate", pop);
    return () => {
      document.removeEventListener("click", click);
      window.removeEventListener("popstate", pop);
      clearTimeout(timer.current);
    };
  }, [path]);

  useEffect(() => {
    const info = pageInfo[path] || {
      title: "Page not found — Milton Klun",
      description: "Return to Milton Klun’s engineering portfolio.",
    };
    document.title = info.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", info.description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute(
        "href",
        `https://miltonklun.com${path === "/" ? "/" : path}`,
      );
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", info.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", info.description);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", `https://miltonklun.com${path}`);
    document.body.dataset.page = gallery ? "gallery" : path.slice(1);
  }, [path, gallery]);

  let page;
  if (gallery) page = <Gallery blocked={!!overlay} />;
  else
    switch (path) {
      case "/about":
        page = <About />;
        break;
      case "/work":
        page = <Work />;
        break;
      case "/experience":
        page = <Experience />;
        break;
      case "/skills":
        page = <Skills />;
        break;
      case "/contact":
        page = <Contact />;
        break;
      case "/cv":
        page = <CV />;
        break;
      default:
        page = <NotFound />;
    }
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div
        className={`app ${path === "/contact" ? "is-contact" : ""}`}
      >
        <Header gallery={gallery || path === "/contact"} open={setOverlay} />
        <div
          className={`route-content ${leaving ? "route-leaving" : ""}`}
          key={path}
        >
          {page}
        </div>
      </div>
      <Navigation overlay={overlay} close={close} />
    </>
  );
}
