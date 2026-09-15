import * as React from 'react';
import { gsap, useGSAP, reveal } from './motion';
import { useReducedMotion } from './useReducedMotion';

/**
 * Reusable scroll-reveal wrapper.
 * Content starts visible in static HTML. When JavaScript is available and
 * reduced motion is not requested, elements settle from a subtle y-offset
 * once on first intersection. Failure or reduced motion shows static content.
 *
 * Rebrand §21 default: y 24px, 0.65s, power3.out, once.
 */
export function ScrollReveal({ children, className, as: Tag = 'div', stagger = false }: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section';
  stagger?: boolean;
}) {
  const scope = React.useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const entered = React.useRef(false);

  useGSAP(() => {
    const element = scope.current;
    if (!element || reducedMotion || entered.current) return;
    const targets = stagger
      ? element.querySelectorAll('[data-reveal-item]')
      : [element];
    if (!targets.length) return;
    gsap.from(targets, {
      y: reveal.y,
      opacity: 0.85,
      onStart: () => { entered.current = true; },
      duration: reveal.duration,
      ease: reveal.ease,
      stagger: stagger ? reveal.stagger : 0,
      clearProps: 'opacity,transform',
      scrollTrigger: {
        trigger: element,
        start: 'top 84%',
        once: true,
      },
    });
  }, { scope, dependencies: [reducedMotion], revertOnUpdate: true });

  return <Tag ref={scope as React.RefObject<HTMLDivElement>} className={className}>{children}</Tag>;
}
