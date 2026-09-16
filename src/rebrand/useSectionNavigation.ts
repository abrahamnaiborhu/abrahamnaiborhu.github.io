import { useEffect, useState } from 'react';

export const navigationItems = [
  ['work', 'Work'], ['experience', 'Experience'], ['writing', 'Writing'], ['about', 'About'],
] as const;

export function useSectionNavigation() {
  const [state, setState] = useState({ active: '', scrolled: false });
  useEffect(() => {
    let frame = 0;
    let deepLinkFrame = 0;
    let cancelled = false;
    const update = () => {
      frame = 0;
      let active = '';
      for (const [id] of navigationItems) {
        if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= innerHeight * 0.35) active = id;
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
