import * as React from 'react';
import { gsap, useGSAP, reveal } from './motion';
import { useReducedMotion } from './useReducedMotion';

export function About() {
  const scope = React.useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const entered = React.useRef(false);

  useGSAP(() => {
    const el = scope.current;
    if (!el || reducedMotion || entered.current) return;
    const timeline = gsap.timeline({
      defaults: { ease: reveal.ease, clearProps: 'opacity,transform' },
      onStart: () => { entered.current = true; },
      scrollTrigger: { trigger: el, start: 'top 84%', once: true },
    });
    timeline
      .from(el.querySelectorAll('.about-copy p'), {
        opacity: 0.85, x: -20, duration: reveal.duration, stagger: 0.12,
      })
      .from(el.querySelectorAll('.education h3, .education p, .education ul, .languages'), {
        opacity: 0.85, y: reveal.y, duration: 0.5, stagger: reveal.stagger,
      }, '-=0.45')
      // The rail draws itself once the column beside it has arrived.
      .from(el.querySelector('.education'), {
        '--education-rail': 0, duration: 0.6, ease: 'power2.out', clearProps: 'all',
      }, '-=0.6');
  }, { scope, dependencies: [reducedMotion], revertOnUpdate: true });

  return <React.Fragment>
    <section ref={scope} id="about" tabIndex={-1} className="section wrap" aria-labelledby="about-title">
      <p className="eyebrow">About</p>
      <h2 id="about-title">Software engineering foundations. Infrastructure focus.</h2>
      <div className="about-grid">
        <div className="about-copy">
          <p>I started from software engineering and enterprise application development, then moved progressively closer to infrastructure: cloud deployments, Infrastructure as Code, CI/CD, production operations, and Kubernetes.</p>
          <p>That software background shapes how I approach platform work. I care about the developer experience as much as the infrastructure itself — repeatable environments, secure delivery, observable systems, and operational simplicity.</p>
        </div>
        <div className="education">
          <h3>President University</h3>
          <p>B.Sc. Information Technology · 2020–2023</p>
          <ul><li>Magna Cum Laude · GPA 3.95</li><li>Scholarship Awardee · Thesis Grade A</li></ul>
          <h3>Bangkit Academy</h3>
          <p>Mobile Development Cohort · 2022</p>
          <ul><li>Distinction — 98.5</li><li>Top 15 / 433 capstone teams</li></ul>
          <h3>Languages</h3>
          <dl className="languages"><div><dt>Indonesian</dt><dd>Native</dd></div><div><dt>English</dt><dd>Professional Working Proficiency</dd></div></dl>
        </div>
      </div>
    </section>
  </React.Fragment>;
}
