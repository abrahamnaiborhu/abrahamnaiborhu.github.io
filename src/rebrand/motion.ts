import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

// One registration boundary for the rebuilt application.
// ScrollTrigger is registered separately in src/main.tsx (browser-only entry)
// to avoid Node ESM resolution failures during static rendering.
// https://gsap.com/resources/React/
gsap.registerPlugin(useGSAP);

export { gsap, useGSAP };
export const entrance = { duration: 0.5, ease: 'power3.out', distance: 8 } as const;

// Shared scroll-reveal defaults (rebrand §21).
// Content starts visible in HTML; these values drive enhancement-only animation.
export const reveal = {
  y: 24,
  duration: 0.65,
  ease: 'power3.out',
  stagger: 0.07,
} as const;
