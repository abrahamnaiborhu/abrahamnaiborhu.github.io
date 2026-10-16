import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../rebrand/useReducedMotion';
import { stateIndex, type SceneDefinition } from './types';

const pinnedQuery = '(min-width: 1000px) and (min-height: 600px)';
const kebab = (name: string) => name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

/** Shows the live scenes instead of their still frames once motion is allowed. */
export function useScenesLive() {
  const reduced = useReducedMotion();
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('scenes-live', !reduced);
    return () => root.classList.remove('scenes-live');
  }, [reduced]);
}

/**
 * Scroll-scrubbed scene. Pinned on roomy screens; elsewhere the timeline runs
 * while the drawing's centre travels from 70% to 30% of the viewport; tall
 * content spreads it from its top at 85% to its bottom at 65%.
 */
export function useScrubScene(scene: SceneDefinition) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const track = ref.current;
    const stage = track?.querySelector<HTMLElement>('[data-scrub-stage]');
    const art = track?.querySelector<HTMLElement>('[data-scrub-art]');
    if (!track || !stage || !art || reduced) return;
    const captions = [...track.querySelectorAll<HTMLElement>('[data-scrub-caption]')];
    const drawing = art.querySelector('svg[role="img"]');
    const dashes = [...track.querySelectorAll<HTMLElement>('[data-scrub-dash]')];
    const parts = new Map([...art.querySelectorAll<Element>('[data-part]')].map(element => [element.getAttribute('data-part')!, element]));
    const pinned = matchMedia(pinnedQuery);
    let frame: number | null = null;
    let shown = -1;
    let state = -1;

    const apply = (p: number) => {
      shown = p;
      for (const [name, attributes] of Object.entries(scene.parts(p))) {
        const element = parts.get(name);
        if (element) for (const [key, value] of Object.entries(attributes)) element.setAttribute(kebab(key), String(value));
      }
      track.style.setProperty('--scene-progress', p.toFixed(3));
      const next = stateIndex(scene, p);
      if (next === state) return;
      state = next;
      track.dataset.state = scene.states[next];
      dashes.forEach((dash, index) => dash.toggleAttribute('data-on', index === next));
      captions.forEach((caption, index) => caption.toggleAttribute('data-on', index === next));
      if (drawing) drawing.setAttribute('aria-label', scene.alts[next]);
    };
    const target = () => {
      if (track.dataset.mode === 'pin') {
        const header = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
        const start = track.getBoundingClientRect().top - header;
        return Math.max(0, Math.min(1, -start / Math.max(1, track.offsetHeight - stage.offsetHeight)));
      }
      const box = art.getBoundingClientRect();
      if (scene.flowAnchor === 'span') return Math.max(0, Math.min(1, (innerHeight * 0.85 - box.top) / (box.height + innerHeight * 0.2)));
      return Math.max(0, Math.min(1, (innerHeight * 0.7 - (box.top + box.height / 2)) / (innerHeight * 0.4)));
    };
    const draw = () => {
      frame = null;
      const goal = target();
      const next = shown < 0 ? goal : shown + (goal - shown) * 0.22;
      apply(Math.abs(goal - next) < 0.001 ? goal : next);
      if (shown !== goal) frame = requestAnimationFrame(draw);
    };
    const queue = () => { if (frame === null) frame = requestAnimationFrame(draw); };
    const measure = () => {
      track.dataset.mode = scene.pinnable !== false && pinned.matches && CSS.supports('position', 'sticky') ? 'pin' : 'flow';
      queue();
    };

    measure();
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', measure);
    pinned.addEventListener('change', measure);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      removeEventListener('scroll', queue);
      removeEventListener('resize', measure);
      pinned.removeEventListener('change', measure);
      track.dataset.mode = 'static';
    };
  }, [scene, reduced]);
  return ref;
}
