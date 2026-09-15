import { useEffect, useState } from 'react';

export const navigationItems = [
  ['work', 'Work'], ['experience', 'Experience'], ['writing', 'Writing'], ['about', 'About'],
] as const;

export function useSectionNavigation() {
  const [state, setState] = useState({ active: '', scrolled: false });
  useEffect(() => {
    let frame = 0;
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
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
    };
  }, []);
  return state;
}
