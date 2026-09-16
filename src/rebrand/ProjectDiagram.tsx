import * as React from 'react';
import { gsap, useGSAP } from './motion';
import { useReducedMotion } from './useReducedMotion';

export function ProjectDiagram({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const scope = React.useRef<HTMLElement>(null);
  const entered = React.useRef(false);
  const reducedMotion = useReducedMotion();

  useGSAP((_context, contextSafe) => {
    const element = scope.current;
    if (!element || reducedMotion || entered.current || typeof IntersectionObserver === 'undefined') return;
    let disposed = false;
    let animation: gsap.core.Timeline | undefined;
    const steps = element.querySelectorAll<HTMLElement>('.foundation-flow > li, .delivery-flow > li, .platform-flow > li');
    // Observer callbacks run after setup, so explicitly register their tweens for cleanup.
    const reveal = contextSafe!(() => {
      if (disposed || entered.current) return;
      entered.current = true;
      animation = gsap.timeline({ defaults: { ease: 'power3.out' } })
        .set(element, { attr: { 'data-motion-state': 'running' } })
        .fromTo(steps, { opacity: 0.75, y: 6 }, {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.08, clearProps: 'opacity,transform',
        })
        .set(element, { attr: { 'data-motion-state': 'complete' } });
    });
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        reveal();
      }
    }, { threshold: 0.15 });
    observer.observe(element);
    return () => {
      disposed = true;
      observer.disconnect();
      animation?.kill();
      gsap.killTweensOf(steps);
      for (const step of steps) {
        step.style.removeProperty('opacity');
        step.style.removeProperty('transform');
      }
      element.dataset.motionState = 'static';
    };
  }, { scope, dependencies: [reducedMotion], revertOnUpdate: true });

  return <figure ref={scope} className="project-diagram" aria-labelledby={`${id}-diagram-title`} data-motion-state="static">
    <figcaption id={`${id}-diagram-title`}>{title}</figcaption>
    {children}
  </figure>;
}
