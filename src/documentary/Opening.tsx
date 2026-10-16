import { ArrowIcon } from '../components/ArrowIcon';
import { useEffect, useRef, useState } from 'react';
import { profile } from '../rebrand/profile';
import { useReducedMotion } from '../rebrand/useReducedMotion';

export function APNMark() {
  return <svg className="apn-mark" viewBox="0 0 280 160" aria-hidden="true"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path data-stroke="a-stem" pathLength="1" strokeWidth="5.5" d="M18 126C32 109 40 65 57 32C60 26 64 28 65 40C68 66 77 104 88 124" />
    <path data-stroke="a-crossbar" pathLength="1" strokeWidth="4.5" d="M28 94C46 85 67 81 87 86" />
    <path data-stroke="p-stem" pathLength="1" strokeWidth="5.5" d="M91 126C96 101 103 62 112 34" />
    <path data-stroke="p-bowl" pathLength="1" strokeWidth="5" d="M109 42C132 23 162 29 160 51C158 73 129 86 103 86" />
    <path data-stroke="n" pathLength="1" strokeWidth="5.5" d="M148 125C152 101 157 69 166 39C173 64 183 99 196 123C202 99 212 59 224 33" />
  </g></svg>;
}

export function Opening() {
  const scope = useRef<HTMLElement>(null);
  const finishRef = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);
  const resolved = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setPlaying(false);
      // The server's conservative snapshot is also true before hydration.
      // Resolve only a real reduced-motion visit, not that temporary snapshot.
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) resolved.current = true;
      return;
    }
    if (resolved.current) return;
    const section = scope.current;
    const mark = document.querySelector<SVGSVGElement>('.identity .apn-mark');
    if (!section || !mark || reduced || typeof Element.prototype.animate !== 'function' || location.hash || scrollY > 10) return;
    try { if (sessionStorage.getItem('apn-opening-seen')) return; } catch { /* Storage is optional. */ }
    let active = true;
    const animations: Animation[] = [];
    const finish = () => {
      if (!active) return;
      active = false;
      resolved.current = true;
      animations.forEach(animation => animation.cancel());
      section.dataset.opening = 'complete';
      setPlaying(false);
      try { sessionStorage.setItem('apn-opening-seen', 'true'); } catch { /* No persistence required. */ }
    };
    finishRef.current = finish;
    const animate = (element: Element | null, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      if (!element) return null;
      const animation = element.animate(frames, { fill:'both', ...options });
      animation.finished.catch(() => {});
      animations.push(animation);
      return animation;
    };
    const bounds = mark.getBoundingClientRect();
    const width = Math.min(innerWidth * .74, 480);
    const left = (innerWidth - width) / 2;
    const top = innerHeight * .44 - width * 160 / 280 / 2;
    section.dataset.opening = 'playing';
    setPlaying(true);
    const strokes = [['a-stem',80,390],['a-crossbar',440,180],['p-stem',590,260],['p-bowl',800,370],['n',1120,460]] as const;
    for (const [name,delay,duration] of strokes) animate(mark.querySelector(`[data-stroke="${name}"]`), [
      {strokeDashoffset:'1',opacity:0,offset:0}, {strokeDashoffset:'.995',opacity:1,offset:.025}, {strokeDashoffset:'0',opacity:1,offset:1},
    ], {delay,duration,easing:'cubic-bezier(.45,.05,.35,1)'});
    animate(mark, [{transform:`translate(${left - bounds.left}px,${top - bounds.top}px) scale(${width / bounds.width})`}, {transform:'translate(0,0) scale(1)'}], {delay:1930,duration:700,easing:'cubic-bezier(.65,0,.2,1)'});
    animate(section.querySelector('.opening-portrait'), [{clipPath:'inset(0 0 100% 0)',transform:'translateY(24px)'},{clipPath:'inset(0)',transform:'translateY(0)'}], {delay:2020,duration:720,easing:'cubic-bezier(.4,0,.2,1)'});
    for (const selector of ['.opening-name','.opening-narration','.opening-context']) animate(section.querySelector(selector), [{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}], {delay:2070,duration:700,easing:'cubic-bezier(.2,.7,.2,1)'});
    const last = animate(section.querySelector('.opening-portrait img'), [{transform:'scale(1.045)'},{transform:'scale(1)'}], {delay:2020,duration:900,easing:'cubic-bezier(.2,.7,.2,1)'});
    void last?.finished.then(finish).catch(() => {});
    const key = (event: KeyboardEvent) => { if (['Escape','ArrowDown','PageDown','End',' '].includes(event.key)) finish(); };
    const focus = (event: FocusEvent) => { if (!(event.target instanceof Element) || !event.target.closest('.skip-opening')) finish(); };
    const hidden = () => { if (document.hidden) finish(); };
    window.addEventListener('wheel',finish,{passive:true});
    window.addEventListener('touchmove',finish,{passive:true});
    window.addEventListener('resize',finish);
    window.addEventListener('hashchange',finish);
    window.addEventListener('pagehide',finish);
    document.addEventListener('keydown',key);
    document.addEventListener('focusin',focus);
    document.addEventListener('visibilitychange',hidden);
    return () => {
      active = false;
      animations.forEach(animation => animation.cancel());
      section.dataset.opening = 'complete';
      window.removeEventListener('wheel',finish); window.removeEventListener('touchmove',finish);
      window.removeEventListener('resize',finish); window.removeEventListener('hashchange',finish); window.removeEventListener('pagehide',finish);
      document.removeEventListener('keydown',key); document.removeEventListener('focusin',focus); document.removeEventListener('visibilitychange',hidden);
    };
  }, [reduced]);

  return <section ref={scope} id="home" className="opening" data-opening="complete" aria-labelledby="hero-title">
    <div className="opening-context"><p className="eyebrow">01 / A starting point</p><p>{profile.name}</p><span>{profile.role} · Jakarta</span><span>Cloud · Platform · DevOps</span></div>
    <div className="opening-name" aria-hidden="true">ABRAHAM</div>
    <figure className="opening-portrait"><img src="/assets/abraham.png" width="408" height="612" alt="Portrait of Abraham Naiborhu" loading="eager" /></figure>
    <div className="opening-narration"><h1 id="hero-title">I like making things<br /><em>work together.</em></h1><div className="opening-actions"><a href="#work">View Engineering Work <ArrowIcon direction="down-right" /></a><a href={profile.resume}>View Resume <ArrowIcon /></a><a href="#contact">Contact me <ArrowIcon /></a></div></div>
    <button type="button" className="skip-opening" hidden={!playing} onClick={() => finishRef.current()}>Skip opening <ArrowIcon /></button>
  </section>;
}
