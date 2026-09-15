import * as React from 'react';
import { primaryCredentials, additionalCredential } from './credentials';
import { gsap, useGSAP, reveal } from './motion';
import { useReducedMotion } from './useReducedMotion';

export function Certifications() {
  const scope = React.useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const entered = React.useRef(false);

  useGSAP(() => {
    const el = scope.current;
    if (!el || reducedMotion || entered.current) return;
    gsap.from(el.querySelectorAll('.certification-grid > li'), {
      opacity: 0.85,
      onStart: () => { entered.current = true; },
      y: reveal.y,
      duration: reveal.duration,
      ease: reveal.ease,
      stagger: reveal.stagger,
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: el.querySelector('.certification-grid'), start: 'top 84%', once: true },
    });
  }, { scope, dependencies: [reducedMotion], revertOnUpdate: true });

  return <React.Fragment>
    <section ref={scope} id="certifications" className="section wrap" aria-labelledby="certifications-title">
      <p className="eyebrow">Certifications</p>
      <h2 id="certifications-title">Validated across cloud, infrastructure, and Kubernetes.</h2>
      <ul className="certification-grid">
        {primaryCredentials.map(credential => <li key={credential.title}>
          <p className="eyebrow">{credential.issuer}</p>
          <h3>{credential.title}</h3>
          <a className="text-link metadata" href={credential.url} aria-label={`View ${credential.title} credential`}>View credential <span aria-hidden="true">↗</span></a>
        </li>)}
      </ul>
      <p className="secondary-credential"><span>Additional training</span><a className="text-link" href={additionalCredential.url}>{additionalCredential.title} ↗</a></p>
    </section>
  </React.Fragment>;
}
