import { ThemeSwitch } from "./ThemeSwitch";
import { SocialLinks } from "./SubtleDetails";
import { useEffect, useRef } from "react";

export type Overlay = "menu" | null;
export function Header({
  gallery,
  open,
}: {
  gallery: boolean;
  open: (value: Overlay) => void;
}) {
  return (
    <header className={`site-header ${gallery ? "on-image" : ""}`}>
      <button
        className="icon-button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        onClick={() => open("menu")}
      >
        <span className="hamburger">
          <i />
          <i />
          <i />
        </span>
      </button>
      <a className="wordmark" href="/" aria-label="Milton Klun, home">
        MILTON KLUN
      </a>
      <span className="header-balance" aria-hidden="true" />
    </header>
  );
}

const entries = [
  { label: "About me", detail: "Engineer · Argentina", path: "/about" },
  {
    label: "Experience",
    detail: "Revelo · PG Original · Wide",
    path: "/experience",
  },
  { label: "Projects", detail: "Projects & case studies", path: "/work" },
  {
    label: "Skills",
    detail: "AI quality · Automation · Training",
    path: "/skills",
  },
  { label: "Contact", detail: "Get in touch", path: "/contact" },
];

export function Navigation({
  overlay,
  close,
}: {
  overlay: Overlay;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (overlay) {
      const focused = document.activeElement as HTMLElement | null;
      if (!node.open) node.showModal();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
        node.close();
        focused?.focus();
      };
    }
  }, [overlay]);

  return (
    <dialog
      ref={dialog}
      className="navigation-dialog"
      aria-label="Portfolio menu"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) close();
      }}
    >
      <div className="navigation-panel">
        <button
          className="icon-button close-button"
          aria-label="Close navigation"
          onClick={close}
        >
          <span className="close-icon" />
        </button>
        {overlay === "menu" && <ThemeSwitch />}
        {overlay === "menu" && (
          <>
            <p className="eyebrow">Menu</p>
            <nav aria-label="Main navigation">
              {entries.slice(0, 5).map((item) => (
                <a key={item.path} href={item.path} onClick={close}>
                  <span className="menu-shine">{item.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
            <div className="menu-contact">
              <SocialLinks />
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
