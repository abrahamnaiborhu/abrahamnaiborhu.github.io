import { ArrowIcon } from '../components/ArrowIcon';
import { useEffect, useRef, useState } from 'react';
import { profile } from '../rebrand/profile';
import { waitForPortfolio } from './portfolioReady';
import { useReducedMotion } from '../rebrand/useReducedMotion';

export function AbrahamMark() {
  return <svg className="apn-mark" data-wordmark="Abraham" viewBox="0 0 500 160" aria-hidden="true"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path data-stroke="a-stem" strokeWidth="5.5" d="M18 126C32 109 40 65 57 32C60 26 64 28 65 40C68 66 77 104 88 124" />
    <path data-stroke="a-crossbar" strokeWidth="4.5" d="M28 94C46 85 67 81 87 86" />
    <path data-stroke="b" strokeWidth="5" d="M94 124C105 95 118 48 119 33C120 20 112 25 106 42C99 62 95 91 98 110C101 128 124 127 137 105C149 83 130 78 116 91C109 98 104 112 106 119C121 125 139 116 149 102" />
    <path data-stroke="r" strokeWidth="5" d="M145 124L158 86C162 76 166 82 161 94C170 81 185 80 188 89C190 94 185 98 181 94" />
    <path data-stroke="a-first" strokeWidth="5" d="M233 91C220 77 204 86 199 104C194 121 207 128 220 114L236 87L228 116C226 129 240 123 251 108" />
    <path data-stroke="h" strokeWidth="5" d="M255 124C264 96 278 49 281 32C283 20 275 26 269 41C263 58 257 85 256 109C270 80 292 80 288 98L282 117C280 129 296 121 306 109" />
    <path data-stroke="a-second" strokeWidth="5" d="M347 91C334 77 318 86 313 104C308 121 321 128 334 114L350 87L342 116C340 129 354 123 365 108" />
    <path data-stroke="m" strokeWidth="5" d="M368 124L380 85C383 79 387 81 383 92L378 111C389 89 407 81 407 96L400 121C412 99 428 80 437 87C442 91 437 104 433 115C429 129 450 125 465 112" />
  </g></svg>;
}

export function Opening() {
  const scope = useRef<HTMLElement>(null);
  const finishRef = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);
  const resolved = useRef(false);
  const claimed = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    const releasePending = (state: 'ready' | 'complete' = 'complete') => {
      root.dataset.apnOpening = state;
      root.dispatchEvent(new Event('apn-opening-ready'));
    };
    if (reduced) {
      setPlaying(false);
      // The server's conservative snapshot is also true before hydration.
      // Resolve only a real reduced-motion visit, not that temporary snapshot.
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        resolved.current = true;
        releasePending();
      }
      return;
    }
    if (resolved.current) { releasePending(); return; }
    // Only the pre-paint reservation may start a first-visit opening. Once its
    // fallback has shown the hero, late hydration must leave that state alone.
    // The ref permits Strict Mode's synchronous setup/cleanup/setup replay.
    if (root.dataset.apnOpening !== 'pending' && !claimed.current) return;
    const section = scope.current;
    const mark = document.querySelector<SVGSVGElement>('.identity .apn-mark');
    if (!section || !mark || reduced || typeof Element.prototype.animate !== 'function' || location.hash || scrollY > 10) {
      releasePending();
      return;
    }
    const reload = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type === 'reload';
    try { if (sessionStorage.getItem('apn-opening-seen') && !reload) { releasePending(); return; } } catch { /* Storage is optional. */ }
    claimed.current = true;
    let active = true;
    const loading = new AbortController();
    const startedAt = performance.now();
    section.dataset.loading = 'pending';
    root.dataset.apnLoading = 'pending';
    const animations: Animation[] = [];
    const strokePaths: SVGPathElement[] = [];
    let removeInterruptions = () => {};
    const clearStrokeStyles = () => strokePaths.forEach(path => path.style.removeProperty('stroke-dasharray'));
    const finish = () => {
      if (!active) return;
      active = false;
      resolved.current = true;
      loading.abort();
      section.dataset.loading = 'complete';
      root.dataset.apnLoading = 'complete';
      removeInterruptions();
      animations.forEach(animation => animation.cancel());
      clearStrokeStyles();
      section.dataset.opening = 'complete';
      releasePending();
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
    const width = Math.min(innerWidth * .84, 600);
    const left = (innerWidth - width) / 2;
    const top = innerHeight * .44 - width * mark.viewBox.baseVal.height / mark.viewBox.baseVal.width / 2;
    section.dataset.opening = 'playing';
    setPlaying(true);
    const strokes = [['a-stem',80,390],['a-crossbar',440,160],['b',560,270],['r',790,150],['a-first',910,210],['h',1080,240],['a-second',1290,200],['m',1460,250]] as const;
    for (const [name,delay,duration] of strokes) {
      const path = mark.querySelector<SVGPathElement>(`[data-stroke="${name}"]`);
      if (!path) continue;
      // Measured SVG lengths keep curved handwriting solid in WebKit.
      const length = Math.ceil(path.getTotalLength());
      path.style.strokeDasharray = `${length} ${length}`;
      strokePaths.push(path);
      const stroke = animate(path, [
        {strokeDashoffset:String(length),opacity:0,offset:0},
        {strokeDashoffset:String(length * .995),opacity:1,offset:.025},
        {strokeDashoffset:'0',opacity:1,offset:1},
      ], {delay,duration,easing:'cubic-bezier(.45,.05,.35,1)'});
      // Return each completed stroke to the solid CSS drawing before handoff.
      void stroke?.finished.then(() => {
        stroke.cancel();
        path.style.removeProperty('stroke-dasharray');
      }).catch(() => {});
    }
    // Handwriting runs immediately. The transfer and introduction wait for actual page readiness.
    const handoffAnimations: Animation[] = [];
    const hold = (animation: Animation | null) => {
      if (animation) { animation.pause(); animation.currentTime = 0; handoffAnimations.push(animation); }
      return animation;
    };
    const handoff = { delay:1930, duration:600 };
    const introductionAt = handoff.delay + handoff.duration + 80;
    hold(animate(mark, [{transform:`translate(${left - bounds.left}px,${top - bounds.top}px) scale(${width / bounds.width})`}, {transform:'translate(0,0) scale(1)'}], {...handoff,easing:'cubic-bezier(.65,0,.2,1)'}));
    // Establish the opaque portrait first. The title crosses behind its stationary silhouette.
    const cutIn = (selector: string, delay: number) => hold(animate(section.querySelector(selector), [{opacity:0},{opacity:1}], {delay,duration:1}));
    cutIn('.opening-introduction', introductionAt);
    cutIn('.opening-context', introductionAt + 220);
    const title = section.querySelector<HTMLElement>('.opening-name');
    if (title) {
      const travel = innerWidth - title.getBoundingClientRect().left + 24;
      hold(animate(title, [{transform:`translateX(${travel}px)`},{transform:'translateX(0)'}], {delay:introductionAt + 100,duration:900,easing:'cubic-bezier(.22,.8,.22,1)'}));
    }
    // Two clipped typographic beats reveal the existing words without moving their baselines.
    const lines = [...section.querySelectorAll<HTMLElement>('[data-hero-line]')];
    const lineAnimations = lines.map((line, index) => hold(animate(line, [{transform:'translateY(130%)'},{transform:'translateY(0)'}], {delay:introductionAt + 520 + index * 170,duration:index === 0 ? 540 : 620,easing:'cubic-bezier(.16,1,.3,1)'})));
    const last = lineAnimations[lineAnimations.length - 1];
    cutIn('.opening-actions', introductionAt + 1190);
    void last?.finished.then(finish).catch(() => {});
    void waitForPortfolio(loading.signal).then(result => {
      if (!active || result === 'aborted') return;
      section.dataset.loading = result;
      root.dataset.apnLoading = result;
      // Preserve the original timing on a warm load; a slow load holds the written mark centrally.
      const time = Math.min(performance.now() - startedAt, handoff.delay);
      handoffAnimations.forEach(animation => { animation.currentTime = time; animation.play(); });
    });
    const key = (event: KeyboardEvent) => { if (['Escape','ArrowDown','PageDown','End',' '].includes(event.key)) finish(); };
    const focus = (event: FocusEvent) => { if (!(event.target instanceof Element) || !event.target.closest('.skip-opening')) finish(); };
    const hidden = () => { if (document.hidden) finish(); };
    removeInterruptions = () => {
      window.removeEventListener('wheel',finish); window.removeEventListener('touchmove',finish);
      window.removeEventListener('resize',finish); window.removeEventListener('hashchange',finish); window.removeEventListener('pagehide',finish);
      document.removeEventListener('keydown',key); document.removeEventListener('focusin',focus); document.removeEventListener('visibilitychange',hidden);
    };
    window.addEventListener('wheel',finish,{passive:true});
    window.addEventListener('touchmove',finish,{passive:true});
    window.addEventListener('resize',finish);
    window.addEventListener('hashchange',finish);
    window.addEventListener('pagehide',finish);
    document.addEventListener('keydown',key);
    document.addEventListener('focusin',focus);
    document.addEventListener('visibilitychange',hidden);
    // Initial animation keyframes now own visibility; remove the pre-paint guard.
    releasePending('ready');
    return () => {
      active = false;
      loading.abort();
      root.dataset.apnLoading = 'complete';
      section.dataset.loading = 'complete';
      animations.forEach(animation => animation.cancel());
      clearStrokeStyles();
      section.dataset.opening = 'complete';
      releasePending();
      removeInterruptions();
    };
  }, [reduced]);

  return <section ref={scope} id="home" className="opening" data-opening="complete" aria-labelledby="hero-title">
    <div className="opening-introduction">
      <div className="opening-context"><p className="eyebrow">01 / A starting point</p><p>{profile.name}</p><span>{profile.role} · Jakarta</span><span>Cloud · Platform · DevOps</span></div>
      <div className="opening-name" aria-hidden="true">ABRAHAM</div>
      <figure className="opening-portrait"><img src="/assets/abraham.png" width="408" height="612" alt="Portrait of Abraham Naiborhu" loading="eager" /></figure>
      <div className="opening-narration"><h1 id="hero-title"><span className="opening-line"><span data-hero-line>I like making things</span></span><span className="opening-line"><span data-hero-line><em>work together.</em></span></span></h1><div className="opening-actions"><a href="#work">View Engineering Work <ArrowIcon direction="down-right" /></a><a href={profile.resume}>View Resume <ArrowIcon /></a><a href="#contact">Contact me <ArrowIcon /></a></div></div>
    </div>
    <p className="opening-load-status" role="status">Preparing portfolio…</p>
    <button type="button" className="skip-opening" hidden={!playing} onClick={() => finishRef.current()}>Skip opening <ArrowIcon /></button>
  </section>;
}
