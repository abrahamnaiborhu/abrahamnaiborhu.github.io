import { useEffect, useState } from 'react';

export const navigationItems = [
  ['work', 'Work'], ['team', 'Platform'], ['experience', 'Experience'], ['writing', 'Writing'], ['about', 'About'], ['contact', 'Contact'],
] as const;

export function useSectionNavigation() {
  const [state, setState] = useState({ active: '', scrolled: false });
  useEffect(() => {
    let frame = 0;
    let deepLinkFrame = 0;
    let cancelled = false;
    const update = () => {
      frame = 0;
      // The passed section nearest the reading line wins, whatever the menu order.
      let active = '';
      let nearest = -Infinity;
      for (const [id] of navigationItems) {
        const top = document.getElementById(id)?.getBoundingClientRect().top ?? Infinity;
        if (top <= innerHeight * 0.35 && top > nearest) { active = id; nearest = top; }
      }
      const scrolled = scrollY > 40;
      setState(previous => previous.active === active && previous.scrolled === scrolled ? previous : { active, scrolled });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const alignInitialDeepLink = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (!target || cancelled) return;
      cancelAnimationFrame(deepLinkFrame);
      deepLinkFrame = requestAnimationFrame(() => target.scrollIntoView());
    };
    update();
    // WebKit can resolve a cross-document fragment before web fonts finish,
    // leaving the target above the final scroll position after layout settles.
    if (window.location.hash) {
      alignInitialDeepLink();
      void document.fonts?.ready.then(alignInitialDeepLink);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(deepLinkFrame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
    };
  }, []);
  return state;
}
