import * as React from "react";
import { profile } from "./profile";
import { navigationItems, useSectionNavigation } from "./useSectionNavigation";

export function Navigation() {
  const dialog = React.useRef<HTMLDialogElement>(null);
  const trigger = React.useRef<HTMLElement>(null);
  const details = React.useRef<HTMLDetailsElement>(null);
  const overflow = React.useRef<string | null>(null);
  const destination = React.useRef<string | null>(null);
  const [enhanced, setEnhanced] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { active, scrolled } = useSectionNavigation();
  const unlock = () => {
    if (overflow.current !== null) document.body.style.overflow = overflow.current;
    overflow.current = null;
  };
  React.useEffect(() => {
    const modal = dialog.current;
    setEnhanced(typeof modal?.showModal === "function");
    const desktop = window.matchMedia("(min-width: 768px)");
    const resize = () => {
      if (desktop.matches) {
        modal?.close();
        if (details.current) details.current.open = false;
      }
    };
    desktop.addEventListener("change", resize);
    return () => {
      desktop.removeEventListener("change", resize);
      modal?.close();
      unlock();
    };
  }, []);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (!enhanced) return; // Native details remains usable before/without JS.
    event.preventDefault();
    if (!dialog.current || dialog.current.open) return;
    destination.current = null;
    dialog.current.showModal();
    overflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setOpen(true);
    dialog.current.querySelector("button")?.focus();
  };
  const onClose = () => {
    unlock();
    setOpen(false);
    if (destination.current) {
      const target = document.getElementById(destination.current);
      target?.focus({ preventScroll: true });
      target?.scrollIntoView();
      destination.current = null;
    } else if (window.matchMedia("(max-width: 767px)").matches)
      trigger.current?.focus({ preventScroll: true });
    else
      document
        .querySelector<HTMLAnchorElement>(".desktop-navigation a")
        ?.focus({ preventScroll: true });
  };
  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    destination.current = id;
    window.location.hash = id;
    dialog.current?.close();
  };
  const wrapFocus = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const controls = dialog.current?.querySelectorAll<HTMLElement>("button, a[href]");
    if (!controls?.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  const links = (inDialog = false) =>
    navigationItems.map(([id, label]) => (
      <a
        key={id}
        href={`#${id}`}
        aria-current={active === id ? "location" : undefined}
        onClick={inDialog ? (event) => navigate(event, id) : undefined}
      >
        {label}
      </a>
    ));

  return (
    <header className="navigation-shell" data-scrolled={scrolled}>
      <div className="site-header wrap">
        <a className="identity" href="#home">
          {profile.shortName}
          <span aria-hidden="true">.</span>
        </a>
        <nav className="desktop-navigation" aria-label="Main navigation">
          {links()}
        </nav>
        <a className="header-resume" href={profile.resume}>
          Resume <span aria-hidden="true">↗</span>
        </a>
        <details className="mobile-navigation" ref={details}>
          <summary
            ref={trigger}
            onClick={openMenu}
            aria-haspopup={enhanced ? "dialog" : undefined}
            aria-expanded={enhanced ? open : undefined}
            aria-controls={enhanced ? "navigation-drawer" : undefined}
          >
            Menu
          </summary>
          <nav aria-label="Mobile navigation">
            {links()}
            <a href={profile.resume}>Resume</a>
          </nav>
        </details>
      </div>
      <dialog
        id="navigation-drawer"
        ref={dialog}
        className="navigation-drawer"
        aria-label="Navigation"
        onClose={onClose}
        onKeyDown={wrapFocus}
      >
        <div className="drawer-heading">
          <span>{profile.shortName}</span>
          <button type="button" onClick={() => dialog.current?.close()}>
            Close menu
          </button>
        </div>
        <p className="eyebrow">Explore</p>
        <nav aria-label="Drawer navigation">
          {links(true)}
          <a href={profile.resume}>Resume</a>
        </nav>
        <p className="drawer-note">
          Cloud &amp; Platform Engineering
          <br />
          {profile.location}
        </p>
      </dialog>
    </header>
  );
}
