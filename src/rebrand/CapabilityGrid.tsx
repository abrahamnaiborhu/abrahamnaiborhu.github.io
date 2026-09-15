import * as React from 'react';
import { capabilities } from './capabilities';
import { gsap, useGSAP, reveal } from './motion';
import { useReducedMotion } from './useReducedMotion';

export function CapabilityGrid() {
  const scope = React.useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const entered = React.useRef(false);

  useGSAP(() => {
    const el = scope.current;
    if (!el || reducedMotion || entered.current) return;
    gsap.from(el.querySelectorAll('.capability-grid > li'), {
      opacity: 0.85,
      onStart: () => { entered.current = true; },
      y: reveal.y,
      duration: reveal.duration,
      ease: reveal.ease,
      stagger: reveal.stagger,
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: el.querySelector('.capability-grid'), start: 'top 84%', once: true },
    });
  }, { scope, dependencies: [reducedMotion], revertOnUpdate: true });

  return <React.Fragment>
    <section ref={scope} id="capabilities" className="capabilities wrap" aria-labelledby="capabilities-title">
      <p className="eyebrow">Capabilities</p>
      <h2 id="capabilities-title">Engineering across infrastructure, delivery, and applications.</h2>
      <p className="capability-intro">A software-engineering foundation combined with hands-on cloud infrastructure, Kubernetes administration, Infrastructure as Code, and automated delivery.</p>
      <ul className="capability-grid">
        {capabilities.map(group => <li key={group.title}>
          <h3>{group.title}</h3>
          <p>{group.technologies.join(' · ')}</p>
        </li>)}
      </ul>
    </section>
  </React.Fragment>;
}
