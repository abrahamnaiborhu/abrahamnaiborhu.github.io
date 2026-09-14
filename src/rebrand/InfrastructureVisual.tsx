import * as React from 'react';
import { gsap, useGSAP } from './motion';
import { useReducedMotion } from './useReducedMotion';

const nodes = [
  { label: 'github', x: 116, y: 18 }, { label: 'ci/cd', x: 116, y: 108 },
  { label: 'terraform', x: 12, y: 226 }, { label: 'image', x: 220, y: 226 },
  { label: 'gcp', x: 12, y: 316 }, { label: 'kubernetes', x: 220, y: 316 },
];

export function InfrastructureVisual() {
  const scope = React.useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    const element = scope.current;
    if (!element || reducedMotion) return;
    // One 1.08s sequence, then rest. No stroke painting, perpetual pulses or scroll pinning.
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    timeline.set(element, { attr: { 'data-motion-state': 'running' } }, 0)
      .fromTo(element, { y: 8, opacity: 0.85 }, { y: 0, opacity: 1, duration: 0.5, clearProps: 'transform,opacity' }, 0)
      .fromTo('.topology-node', { opacity: 0.75 }, { opacity: 1, duration: 0.4, stagger: 0.06, clearProps: 'opacity' }, 0.1)
      .to('.flow-emphasis', { opacity: 0.9, duration: 0.18, stagger: 0.15 }, 0.2)
      .to('.flow-emphasis', { opacity: 0, duration: 0.22, stagger: 0.12 }, 0.62)
      .set(element, { attr: { 'data-motion-state': 'complete' } }, 1.08);
  }, { scope, dependencies: [reducedMotion], revertOnUpdate: true });

  return <figure ref={scope} className="topology" data-motion-state="static">
    <figcaption><span>01 / Delivery system</span><span>Conceptual</span></figcaption>
    <svg viewBox="0 0 360 376" role="img" aria-label="Conceptual delivery system: GitHub feeds CI/CD, branching through Terraform to Google Cloud and through a container image to Kubernetes. Not a deployed-system or live-health claim.">
      <g fill="none" className="diagram-wire">
        <path d="M180 66V108 M180 156V192H76V226 M180 192H284V226 M76 274V316 M284 274V316" />
      </g>
      <g fill="none" className="diagram-accent" aria-hidden="true">
        <path className="flow-emphasis" d="M180 66V108" />
        <path className="flow-emphasis" d="M180 156V192H76V226" />
        <path className="flow-emphasis" d="M76 274V316" />
      </g>
      {nodes.map(({ label, x, y }) => <g className="topology-node" key={label} transform={`translate(${x} ${y})`}>
        <rect width="128" height="48" rx="8" />
        <text x="64" y="29" textAnchor="middle">{label}</text>
      </g>)}
      <circle cx="180" cy="192" r="3" fill="currentColor" className="diagram-junction" aria-hidden="true" />
    </svg>
    <p className="diagram-note">From source to infrastructure.<br />Repeatable by design.</p>
  </figure>;
}
