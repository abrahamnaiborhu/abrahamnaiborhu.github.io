import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

// One registration boundary for the rebuilt application.
// https://gsap.com/resources/React/
gsap.registerPlugin(useGSAP);
export { gsap, useGSAP };
export const entrance = { duration: 0.5, ease: 'power3.out', distance: 8 } as const;
