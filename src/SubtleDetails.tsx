import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";
import { email, github, linkedin } from "./content";

// Paths from the original portfolio's Lucide icons (ISC; see THIRD_PARTY_NOTICES.txt).
export function SocialIcon({ name }: { name: "mail" | "linkedin" | "github" }) {
  return (
    <svg
      className="social-icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "mail" && (
        <>
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </>
      )}
      {name === "linkedin" && (
        <>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </>
      )}
      {name === "github" && (
        <>
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </>
      )}
    </svg>
  );
}

export function SocialLinks() {
  return (
    <div className="social-links">
      <a
        href={`mailto:${email}`}
        aria-label="Email Milton"
        title="Email Milton"
      >
        <SocialIcon name="mail" />
      </a>
      <a href={linkedin} aria-label="LinkedIn" title="LinkedIn">
        <SocialIcon name="linkedin" />
      </a>
      <a href={github} aria-label="GitHub" title="GitHub">
        <SocialIcon name="github" />
      </a>
      <a href="/cv" aria-label="View CV" title="View CV">
        <svg
          className="social-icon"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h6" />
        </svg>
      </a>
    </div>
  );
}

// A scoped adaptation of the previous BorderGlow/ParticleGrid interaction:
// pointer-local CSS light, no global listeners and no idle animation loop.
export function HoverSurface({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== "mouse" ||
      !matchMedia(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;
    const node = event.currentTarget;
    const { left, top } = node.getBoundingClientRect();
    const x = event.clientX - left,
      y = event.clientY - top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      node.style.setProperty("--pointer-x", `${x}px`);
      node.style.setProperty("--pointer-y", `${y}px`);
      node.style.setProperty("--pointer-active", "1");
    });
  };
  return (
    <div
      className={`${className} hover-surface has-border-light`}
      onPointerMove={move}
      onPointerLeave={(event) => {
        cancelAnimationFrame(frame.current);
        event.currentTarget.style.setProperty("--pointer-active", "0");
      }}
    >
      {children}
      <span className="hover-light" aria-hidden="true" />
    </div>
  );
}
