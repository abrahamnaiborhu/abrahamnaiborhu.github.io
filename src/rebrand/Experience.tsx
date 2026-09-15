import * as React from 'react';
import { experience } from './experienceData';
import { gsap, useGSAP, reveal } from './motion';
import { useReducedMotion } from './useReducedMotion';

export function Experience() {
  const scope = React.useRef<HTMLElement>(null);
  const entered = React.useRef(new WeakSet<Element>());
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    const el = scope.current;
    if (!el || reducedMotion) return;

    // Scroll-progress rail: muted line fills downward (rebrand §15/§35).
    const progress = el.querySelector('.timeline-progress');
    if (progress) {
      gsap.fromTo(progress, { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el.querySelector('.career-timeline'),
          start: 'top 65%',
          end: 'bottom 65%',
          scrub: true,
        },
      });
    }

    // Career cards: subtle y entrance, once on entry.
    const cards = el.querySelectorAll('.career-timeline > li');
    cards.forEach(card => {
      if (entered.current.has(card)) return;
      gsap.from(card, {
        opacity: 0.85,
        onStart: () => { entered.current.add(card); },
        y: 18,
        duration: reveal.duration,
        ease: reveal.ease,
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: card, start: 'top 84%', once: true },
      });
    });
  }, { scope, dependencies: [reducedMotion], revertOnUpdate: true });

  return <React.Fragment>
    <section ref={scope} id="experience" tabIndex={-1} className="section wrap section-experience" aria-labelledby="experience-title">
      <p className="eyebrow">Experience</p>
      <h2 id="experience-title">From software engineering to cloud and platform ownership.</h2>
      <div className="career-track">
        <div className="timeline-progress" aria-hidden="true" />
      <ol className="career-timeline">
        {experience.map(job => <li key={job.company} className={job.end === null ? 'current-role' : undefined}>
          <p className="career-date"><time dateTime={job.start}>{job.startLabel}</time> — {job.end ? <time dateTime={job.end}>{job.endLabel}</time> : job.endLabel}<span> · {job.location}</span></p>
          <h3>{job.role}</h3>
          <p className="career-company">{job.company}</p>
          <ul className="career-highlights">{job.highlights.map(text => <li key={text}>{text}</li>)}</ul>
        </li>)}
      </ol>
      </div>
    </section>
  </React.Fragment>;
}
