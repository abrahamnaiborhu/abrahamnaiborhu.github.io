import * as React from 'react';
import { profile } from './profile';
import { gsap, useGSAP, reveal } from './motion';
import { useReducedMotion } from './useReducedMotion';

export function Contact() {
  const scope = React.useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const entered = React.useRef(false);

  useGSAP(() => {
    const el = scope.current;
    if (!el || reducedMotion || entered.current) return;
    gsap.from([el.querySelector('h2'), el.querySelector('.actions')], {
      opacity: 0.85,
      onStart: () => { entered.current = true; },
      y: reveal.y,
      duration: reveal.duration,
      ease: reveal.ease,
      stagger: 0.12,
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: el, start: 'top 84%', once: true },
    });
  }, { scope, dependencies: [reducedMotion], revertOnUpdate: true });

  return <React.Fragment>
    <section ref={scope} id="contact" className="section wrap contact" aria-labelledby="contact-title">
      <p className="eyebrow">Contact</p>
      <h2 id="contact-title">Let&apos;s talk about cloud, platform engineering, or infrastructure.</h2>
      <p>For professional opportunities, technical collaboration, or engineering discussions, the best ways to reach me are email or LinkedIn.</p>
      <div className="actions"><a className="button primary" href={`mailto:${profile.email}`}>Email Abraham <span aria-hidden="true">↗</span></a><a className="button secondary" href={profile.linkedin}>LinkedIn <span aria-hidden="true">↗</span></a></div>
      <p className="contact-address">{profile.email}</p>
      <div className="contact-links"><a className="text-link" href={profile.github}>GitHub <span aria-hidden="true">↗</span></a><a className="text-link" href={profile.writing}>Dev.to <span aria-hidden="true">↗</span></a></div>
      <p id="resume-note" className="metadata"><a className="text-link" href={profile.resumePdf} download>Download résumé (PDF) <span aria-hidden="true">↓</span></a></p>
    </section>
  </React.Fragment>;
}

export function Footer() {
  return <footer className="site-footer wrap">
    <div><p>© 2026 {profile.shortName}</p><p className="metadata">{profile.name} · {profile.location}</p></div>
    <nav aria-label="Footer"><a href={profile.github}>GitHub</a><a href={profile.linkedin}>LinkedIn</a><a href={profile.writing}>Dev.to</a><a href="#home">Back to top ↑</a></nav>
  </footer>;
}
