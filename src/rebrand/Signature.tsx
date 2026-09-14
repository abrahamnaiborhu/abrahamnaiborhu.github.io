import * as React from 'react';
import { gsap, useGSAP, entrance } from './motion';
import { useReducedMotion } from './useReducedMotion';
import { profile } from './profile';

export function Signature() {
  const scope = React.useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    if (reducedMotion || !scope.current) return;
    // The initial CSS is visible. Even this enhanced starting state stays readable.
    gsap.fromTo(scope.current,
      { y: entrance.distance, opacity: 0.85 },
      { y: 0, opacity: 1, duration: entrance.duration, ease: entrance.ease, clearProps: 'transform,opacity' },
    );
  }, { scope, dependencies: [reducedMotion], revertOnUpdate: true });

  return <p ref={scope} className="hero-signature" data-testid="motion-sample">{profile.name}</p>;
}
