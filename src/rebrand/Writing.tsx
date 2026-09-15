import * as React from 'react';
import { articles } from './articles';
import { profile } from './profile';
import { gsap, useGSAP, reveal } from './motion';
import { useReducedMotion } from './useReducedMotion';

export function Writing() {
  const scope = React.useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const entered = React.useRef(false);

  useGSAP(() => {
    const el = scope.current;
    if (!el || reducedMotion || entered.current) return;
    entered.current = true;
    gsap.from(el.querySelectorAll('.writing-list > li'), {
      opacity: 0.85,
      y: reveal.y,
      duration: reveal.duration,
      ease: reveal.ease,
      stagger: reveal.stagger,
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: el.querySelector('.writing-list'), start: 'top 84%', once: true },
    });
  }, { scope, dependencies: [reducedMotion], revertOnUpdate: true });

  return <React.Fragment>
    <section ref={scope} id="writing" tabIndex={-1} className="section wrap" aria-labelledby="writing-title">
      <p className="eyebrow">Technical writing</p>
      <h2 id="writing-title">Documenting the engineering decisions behind the implementation.</h2>
      <p>Architecture notes, infrastructure experiments, and implementation breakdowns covering Google Cloud, Terraform, CI/CD, DevOps, and SRE practices.</p>
      <ol className="writing-list">
        {articles.map((article, index) => <li key={article.url}>
          <a className="writing-row" href={article.url} target="_blank" rel="noopener noreferrer" aria-labelledby={`article-title-${index}`}>
            <span className="writing-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div><h3 id={`article-title-${index}`}>{article.title}</h3><p>{article.topics}</p></div>
            <span className="writing-arrow" aria-hidden="true">↗</span>
          </a>
        </li>)}
      </ol>
      <a className="text-link" href={profile.writing} target="_blank" rel="noopener noreferrer">Read all articles on Dev.to <span aria-hidden="true">↗</span></a>
    </section>
  </React.Fragment>;
}
