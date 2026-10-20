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
 * content spreads it from its top at 85% to its bottom at 65%. Product scenes
 * keep the drawing and caption together within the usable reading area.
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
    const captionBlock = track.querySelector<HTMLElement>('.scene-caption');
    const drawing = art.querySelector('svg[role="img"]');
    const dashes = [...track.querySelectorAll<HTMLElement>('[data-scrub-dash]')];
    const parts = new Map([...art.querySelectorAll<Element>('[data-part]')].map(element => [element.getAttribute('data-part')!, element]));
    const pinned = matchMedia(pinnedQuery);
    const product = track.hasAttribute('data-product-film');
    const controls = [...track.querySelectorAll<HTMLButtonElement>('[data-scene-seek]')];
    const words = [...track.querySelectorAll<HTMLElement>('[data-film-word]')];
    const life = new AbortController();
    let overflowed = false;
    let chosenFlowProgress: number | null = null;
    const grid = stage.querySelector<HTMLElement>('.scene-grid');
    let frame: number | null = null;
    let shown = -1;
    let state = -1;

    const apply = (p: number) => {
      if(p === shown) return;
      shown = p;
      for (const [name, attributes] of Object.entries(scene.parts(p))) {
        const element = parts.get(name);
        if (element) for (const [key, value] of Object.entries(attributes)) {
          const attribute=kebab(key), text=String(value);
          if(element.getAttribute(attribute)!==text) element.setAttribute(attribute,text);
        }
      }
      track.style.setProperty('--scene-progress', p.toFixed(3));
      const next = stateIndex(scene, p);
      if (next === state) return;
      state = next;
      controls.forEach((button,i) => button.setAttribute('aria-pressed',String(i===next)));
      words.forEach((word,i) => word.toggleAttribute('data-on',i===next));
      track.dataset.state = scene.states[next];
      dashes.forEach((dash, index) => dash.toggleAttribute('data-on', index === next));
      captions.forEach((caption, index) => caption.toggleAttribute('data-on', index === next));
      if (drawing) drawing.setAttribute('aria-label', scene.alts[next]);
    };
    const target = () => {
      if(product && track.dataset.mode === 'flow' && chosenFlowProgress !== null) return chosenFlowProgress;
      if (track.dataset.mode === 'pin') {
        const header = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
        const start = track.getBoundingClientRect().top - header;
        return Math.max(0, Math.min(1, -start / Math.max(1, track.offsetHeight - stage.offsetHeight)));
      }
      const box = art.getBoundingClientRect();
      if (track.dataset.flowAnchor === 'caption' && captionBlock) {
        const caption = captionBlock.getBoundingClientRect();
        const top = Math.min(box.top, caption.top);
        const height = Math.max(box.bottom, caption.bottom) - top;
        const header = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
        const start = innerHeight * 0.9 - height;
        const end = header + 20;
        // If enlarged text cannot fit with the art, retain natural scrolling.
        if (start > end) return Math.max(0, Math.min(1, (start - top) / (start - end)));
      }
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
      const header = document.querySelector('header')?.getBoundingClientRect().height ?? 80;
      const eligible = product ? innerHeight-header >= 500 && !overflowed : pinned.matches;
      track.dataset.mode = scene.pinnable !== false && eligible && CSS.supports('position', 'sticky') ? 'pin' : 'flow';
      if(product && stage.clientHeight > 0 && track.dataset.mode === 'pin' && (stage.scrollHeight > stage.clientHeight + 2 || art.getBoundingClientRect().height < 145)) {
        overflowed=true;track.dataset.mode='flow';
      }
      queue();
    };

    const reflow = () => {overflowed=false;chosenFlowProgress=null;measure();};
    controls.forEach(button => button.addEventListener('click',() => {
      const p=Number(button.dataset.sceneSeek);
      if(track.dataset.mode === 'pin') {
        const header=document.querySelector('header')?.getBoundingClientRect().height ?? 80;
        scrollTo({top:track.getBoundingClientRect().top+scrollY-header+(track.offsetHeight-stage.offsetHeight)*p,behavior:'instant'});
        apply(target());
      } else {chosenFlowProgress=p;apply(p);}
    },{signal:life.signal}));
    const observer = new ResizeObserver(measure);
    if (grid) observer.observe(grid);
    measure();
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', reflow);
    addEventListener('portfolio-ready', reflow);
    pinned.addEventListener('change', reflow);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      removeEventListener('scroll', queue);
      removeEventListener('resize', reflow);
      removeEventListener('portfolio-ready', reflow);
      pinned.removeEventListener('change', reflow);
      observer.disconnect();
      life.abort();
      track.dataset.mode = 'static';
    };
  }, [scene, reduced]);
  return ref;
}
