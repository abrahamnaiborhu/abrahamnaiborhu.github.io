import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../rebrand/useReducedMotion';

const steps = ['source','build','config','runtime','complete'] as const;

export function usePlatformScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const film = ref.current;
    const stage = film?.querySelector<HTMLElement>('.platform-stage');
    if (!film || !stage) return;
    const roomy = matchMedia('(min-width: 1000px) and (min-height: 600px)');
    let frame: number | null = null;
    let enabled = false;
    let start = 0;
    let range = 1;
    const listSteps = [...film.querySelectorAll<HTMLElement>('.platform-mobile-flow li')];
    // Unpinned: each step of the vertical list lights up once it passes 60% of the viewport.
    const markList = () => listSteps.forEach(step => step.toggleAttribute('data-on', step.getBoundingClientRect().top < innerHeight * 0.6));
    const draw = () => {
      frame = null;
      if (!enabled) { if (!reduced) markList(); return; }
      const progress = Math.max(0,Math.min(1,(scrollY - start) / range));
      const index = Math.min(4,Math.floor(progress * 5));
      film.dataset.step = steps[index];
      film.style.setProperty('--workflow-progress',String(progress));
    };
    const measure = () => {
      const header = document.querySelector('header');
      const height = header?.getBoundingClientRect().height || 80;
      document.documentElement.style.setProperty('--nav-height',`${height}px`);
      enabled = roomy.matches && !reduced && CSS.supports('position','sticky');
      film.dataset.scroll = String(enabled);
      if (!enabled) { film.dataset.step = 'complete'; film.style.removeProperty('--workflow-progress'); if (!reduced) markList(); return; }
      start = film.getBoundingClientRect().top + scrollY - height;
      range = Math.max(1,film.offsetHeight - stage.offsetHeight);
      draw();
    };
    const queue = () => { if ((enabled || !reduced) && frame === null) frame = requestAnimationFrame(draw); };
    const observer = new ResizeObserver(measure);
    observer.observe(film);
    measure();
    window.addEventListener('scroll',queue,{passive:true});
    window.addEventListener('resize',measure);
    window.addEventListener('pageshow',measure);
    roomy.addEventListener('change',measure);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll',queue);window.removeEventListener('resize',measure);window.removeEventListener('pageshow',measure);
      roomy.removeEventListener('change',measure);
      film.dataset.scroll = 'false';film.dataset.step = 'complete';film.style.removeProperty('--workflow-progress');
      listSteps.forEach(step => step.removeAttribute('data-on'));
    };
  },[reduced]);
  return ref;
}
