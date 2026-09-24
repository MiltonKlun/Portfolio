import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { chapters } from "./content";
import { LandingBackground } from "./LandingBackground";

const count = chapters.length;
const wrap = (n: number) => ((n % count) + count) % count;

export function Art({
  name,
  eager = false,
  className = "",
}: {
  name: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <picture className={`art ${className}`}>
      <img
        src={`/images/${name}.webp`}
        alt=""
        width="1672"
        height="941"
        loading={eager ? "eager" : "lazy"}
        {...{ fetchpriority: eager ? "high" : "auto" }}
        decoding="async"
      />
    </picture>
  );
}

export function Gallery({ blocked }: { blocked: boolean }) {
  const [cursor, setCursor] = useState(count);
  const [resetting, setResetting] = useState(false);
  const stage = useRef<HTMLElement>(null);
  const lock = useRef(0);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);
  const index = wrap(cursor);

  const select = useCallback((next: number) => {
    setResetting(false);
    setCursor(next);
    lock.current = Date.now() + 850;
    history.replaceState(null, "", `/#${chapters[wrap(next)].id}`);
  }, []);

  useEffect(() => {
    const sync = () => {
      const i = chapters.findIndex((c) => `#${c.id}` === location.hash);
      if (i >= 0) {
        setResetting(true);
        setCursor(count + i);
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (cursor >= count && cursor < count * 2) return;
    const timer = window.setTimeout(() => {
      setResetting(true);
      setCursor(count + wrap(cursor));
    }, 950);
    return () => clearTimeout(timer);
  }, [cursor]);

  useEffect(() => {
    if (blocked) return;
    let delta = 0;
    let last = 0;
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      event.preventDefault();
      const now = Date.now();
      if (now < lock.current) return;
      if (now - last > 180) delta = 0;
      last = now;
      const value =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      delta +=
        value *
        (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (Math.abs(delta) > 70) {
        select(cursor + Math.sign(delta));
        delta = 0;
      }
    };
    const key = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (event.target as HTMLElement).matches("input,textarea,select")
      )
        return;
      let next: number | undefined;
      if (["ArrowRight", "ArrowDown", "PageDown"].includes(event.key))
        next = cursor + 1;
      if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key))
        next = cursor - 1;
      if (event.key === "Home") next = count;
      if (event.key === "End") next = count * 2 - 1;
      if (next !== undefined) {
        event.preventDefault();
        select(next);
      }
    };
    const node = stage.current;
    node?.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", key);
    return () => {
      node?.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", key);
    };
  }, [blocked, cursor, select]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="gallery"
      ref={stage}
      aria-label="Portfolio chapters"
      aria-roledescription="carousel"
      onPointerDown={(event) => {
        if (!blocked) {
          pointer.current = { x: event.clientX, y: event.clientY };
          dragged.current = false;
        }
      }}
      onPointerCancel={() => {
        pointer.current = null;
      }}
      onPointerUp={(event) => {
        if (!pointer.current || blocked) return;
        const dx = pointer.current.x - event.clientX,
          dy = pointer.current.y - event.clientY;
        pointer.current = null;
        if (Math.max(Math.abs(dx), Math.abs(dy)) > 55) {
          dragged.current = true;
          select(cursor + Math.sign(Math.abs(dx) > Math.abs(dy) ? dx : dy));
        }
      }}
      onClickCapture={(event) => {
        if (dragged.current) {
          event.preventDefault();
          event.stopPropagation();
          dragged.current = false;
        }
      }}
    >
      <div className="scenes">
        <LandingBackground chapter={index} paused={blocked} />
        {chapters.map((chapter, i) => (
          <section
            key={chapter.id}
            className={`scene ${i === index ? "is-active" : ""}`}
            aria-hidden={i !== index}
            aria-label={chapter.title}
          >
            <div className="scene-shade" />
            <div className="scene-copy">
              <p className="eyebrow">
                {i === 0 ? "AI Quality · SDET" : chapter.category}
              </p>
              {i === 0 ? (
                <h1>{chapter.heading}</h1>
              ) : (
                <h2>{chapter.heading}</h2>
              )}
              <p className="scene-description">{chapter.description}</p>
              <div className="scene-actions">
                <a
                  className="text-link"
                  href={chapter.path}
                  tabIndex={i === index ? 0 : -1}
                >
                  {chapter.action}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </section>
        ))}
      </div>
      <footer className="chapter-footer">
        <nav aria-label="Chapters" className="chapter-window">
          <div
            className={`chapter-track ${resetting ? "is-resetting" : ""}`}
            style={{ "--cursor": cursor } as CSSProperties}
          >
            {Array.from({ length: count * 3 }, (_, n) => {
              const item = chapters[wrap(n)];
              const offset = n - cursor;
              const visible = Math.abs(offset) <= 3;
              return (
                <a
                  key={n}
                  href={item.path}
                  className={`chapter-item ${offset === 0 ? "is-current" : ""}`}
                  style={{ "--distance": Math.abs(offset) } as CSSProperties}
                  aria-label={
                    offset === 0 ? `Open ${item.title}` : `Show ${item.title}`
                  }
                  aria-current={offset === 0 ? "true" : undefined}
                  aria-hidden={!visible}
                  tabIndex={offset === 0 ? 0 : -1}
                  onClick={(event) => {
                    if (n !== cursor) {
                      event.preventDefault();
                      select(n);
                    }
                  }}
                >
                  <span className="chapter-title">{item.title}</span>
                </a>
              );
            })}
          </div>
        </nav>
        <div className="progress-row">
          <button
            aria-label="Previous chapter"
            className="chapter-arrow"
            onClick={() => select(cursor - 1)}
          >
            ←
          </button>
          <div
            className="chapter-progress"
            role="progressbar"
            aria-label="Chapter progress"
            aria-valuemin={1}
            aria-valuemax={count}
            aria-valuenow={index + 1}
            aria-valuetext={`${chapters[index].title}, ${index + 1} of ${count}`}
          >
            <span style={{ transform: `scaleX(${(index + 1) / count})` }} />
          </div>
          <button
            aria-label="Next chapter"
            className="chapter-arrow"
            onClick={() => select(cursor + 1)}
          >
            →
          </button>
        </div>
      </footer>
      <p className="sr-only" role="status" aria-live="polite">
        {chapters[index].title}, chapter {index + 1} of {count}
      </p>
    </main>
  );
}
