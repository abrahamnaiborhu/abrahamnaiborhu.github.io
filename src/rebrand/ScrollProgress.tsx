import * as React from "react";
import { gsap, useGSAP } from "./motion";
import { useReducedMotion } from "./useReducedMotion";

/**
 * A one-pixel reading indicator across the top of the viewport, scrubbed by the
 * document's own scroll. It carries no content, so reduced motion removes it
 * rather than freezing it at zero.
 */
export function ScrollProgress() {
  const bar = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const element = bar.current;
      if (!element || reducedMotion) return;
      gsap.fromTo(
        element,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 },
        },
      );
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  if (reducedMotion) return null;
  return <div className="scroll-progress" ref={bar} aria-hidden="true" />;
}
