import { useEffect, useRef } from 'react';
import markup from './unfold/scene';
import { mountUnfold } from './unfold/motion';

/** The approved physical unfolding scene, scoped to its own authored stage. */
export function Unfold() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => root.current ? mountUnfold(root.current) : undefined, []);
  return <section id="behind-the-application" className="unfold" ref={root} aria-label="A wider engineering responsibility">
    <div dangerouslySetInnerHTML={{ __html: markup }} />
    <details className="unfold-transcript">
      <summary>From applications to platform engineering</summary>
      <p>I design, build, deploy and monitor applications. That experience led me to build a shared development and staging platform for the team.</p>
      <p>This is a conceptual illustration of my responsibilities, rather than a diagram of where these products are hosted.</p>
    </details>
  </section>;
}
