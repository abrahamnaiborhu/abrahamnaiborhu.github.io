import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../rebrand/useReducedMotion';
import { bindPlatformPose } from './platformPose';

const steps = ['source','build','config','runtime','complete'] as const;

export function usePlatformScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const film = ref.current;
    const stage = film?.querySelector<HTMLElement>('.platform-stage');
    if (!film || !stage) return;
    const pose = bindPlatformPose(film);
    const controls = film.querySelector<HTMLElement>('.platform-phase-controls')!;
    const buttons = [...controls.querySelectorAll<HTMLButtonElement>('button')];
    const life = new AbortController();
    let frame: number | null = null;
    let enabled = false;
    let start = 0;
    let range = 1;
    let progress = 1;
    let rendered = false;
    const apply = (p:number) => {
      const next=Math.max(0,Math.min(1,p));
      if(rendered && next===progress) return;
      rendered=true;progress=next;
      const index = Math.min(4,Math.floor(progress*5));
      film.dataset.step = steps[index];
      film.style.setProperty('--workflow-progress',String(progress));
      pose(progress);
      buttons.forEach((button,i) => button.setAttribute('aria-pressed',String(i===index)));
    };
    const draw = () => { frame=null; if(enabled) apply((scrollY-start)/range); };
    const queue = () => { if(enabled && frame===null) frame=requestAnimationFrame(draw); };
    const measure = () => {
      const height = document.querySelector('header')?.getBoundingClientRect().height || 80;
      document.documentElement.style.setProperty('--nav-height',`${height}px`);
      // Touch devices retain the authored animation. Only available height and text fit govern pinning.
      film.dataset.motion=String(!reduced);
      enabled = !reduced && innerHeight-height>=500 && CSS.supports('position','sticky');
      film.dataset.scroll=String(enabled);
      const art = film.querySelector<HTMLElement>('.platform-payoff')!;
      if(enabled && (stage.scrollHeight>stage.clientHeight+2 || art.clientHeight<150)) {
        enabled=false;film.dataset.scroll='false';
      }
      start=film.getBoundingClientRect().top+scrollY-height;
      range=Math.max(1,film.offsetHeight-stage.offsetHeight);
      controls.hidden=reduced;
      if(enabled) draw();else apply(reduced?1:progress);
    };
    buttons.forEach(button => button.addEventListener('click', () => {
      const p=Number(button.dataset.platformSeek);
      if(enabled) {scrollTo({top:start+range*p,behavior:'instant'});draw();}
      else apply(p);
    },{signal:life.signal}));
    const observer = new ResizeObserver(measure);
    observer.observe(film);
    measure();
    addEventListener('scroll',queue,{passive:true,signal:life.signal});
    addEventListener('resize',measure,{signal:life.signal});
    addEventListener('pageshow',measure,{signal:life.signal});
    addEventListener('portfolio-ready',measure,{signal:life.signal});
    return () => {
      life.abort();observer.disconnect();
      if(frame!==null) cancelAnimationFrame(frame);
      film.dataset.scroll='false';film.dataset.motion='false';film.dataset.step='complete';
      film.style.removeProperty('--workflow-progress');controls.hidden=true;
    };
  },[reduced]);
  return ref;
}
