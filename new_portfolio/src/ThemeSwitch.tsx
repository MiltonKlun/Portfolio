import { useEffect, useState } from "react";

export function ThemeSwitch() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const sync = () =>
      setDark(document.documentElement.dataset.theme === "dark");
    sync();
    const media = matchMedia("(prefers-color-scheme: dark)");
    const followSystem = () => {
      try {
        if (localStorage.getItem("portfolio-theme")) return;
      } catch {}
      document.documentElement.dataset.theme = media.matches ? "dark" : "light";
      sync();
    };
    media.addEventListener("change", followSystem);
    return () => media.removeEventListener("change", followSystem);
  }, []);
  return (
    <button
      className="theme-switch"
      onPointerMove={(event) => {
        if (
          event.pointerType !== "mouse" ||
          matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const r = event.currentTarget.getBoundingClientRect();
        const angle =
          (Math.atan2(
            event.clientY - r.top - r.height / 2,
            event.clientX - r.left - r.width / 2,
          ) *
            180) /
            Math.PI +
          90;
        event.currentTarget.style.setProperty("--cursor-angle", `${angle}deg`);
      }}
      role="switch"
      aria-checked={dark}
      aria-label="Dark theme"
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => {
        const next = !dark;
        document.documentElement.dataset.theme = next ? "dark" : "light";
        try {
          localStorage.setItem("portfolio-theme", next ? "dark" : "light");
        } catch {}
        setDark(next);
      }}
    >
      <span className="toggle-edge-light" aria-hidden="true" />
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </>
        ) : (
          <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
        )}
      </svg>
    </button>
  );
}
