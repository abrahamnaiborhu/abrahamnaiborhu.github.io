import * as React from 'react';
import { primaryCredentials } from './credentials';
import { gsap, useGSAP, reveal } from './motion';
import { useReducedMotion } from './useReducedMotion';

export function CredentialStrip() {
  const scope = React.useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();
  const entered = React.useRef(false);

  useGSAP(() => {
    const el = scope.current;
    if (!el || reducedMotion || entered.current) return;
    gsap.from(el.querySelectorAll('li'), {
      opacity: 0.85,
      onStart: () => { entered.current = true; },
      y: reveal.y,
      duration: reveal.duration,
      ease: reveal.ease,
      stagger: reveal.stagger,
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  }, { scope, dependencies: [reducedMotion], revertOnUpdate: true });

  return <React.Fragment>
    <ul ref={scope} className="credential-strip wrap" aria-label="Primary certifications">
      {primaryCredentials.map(credential => <li key={credential.title}>
        <span>{credential.issuer}</span><p>{credential.title}</p>
      </li>)}
    </ul>
  </React.Fragment>;
}
