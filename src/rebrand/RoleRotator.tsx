import * as React from "react";
import { gsap, useGSAP } from "./motion";
import { useReducedMotion } from "./useReducedMotion";

/**
 * The discipline word in the hero eyebrow flips between the areas the role
 * actually covers. The job title itself never rotates: the invented-title
 * reading is the one thing this must not suggest.
 *
 * Two stacked layers cross-flip so a word is on screen at every frame. Static
 * HTML and reduced motion show the first word in the first layer, with the
 * second layer empty. Assistive technology reads the full list once from the
 * sibling text instead of hearing an announcement on every flip.
 */
const ROLES = ["Cloud", "Platform", "DevOps", "Kubernetes"] as const;
const rotation = { flip: 0.52, hold: 2.4, hidden: 1.2 } as const;

function paint(host: HTMLElement, word: string) {
  host.replaceChildren(
    ...[...word].map(character => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = character;
      return span;
    }),
  );
  return [...host.children] as HTMLElement[];
}

export function RoleRotator() {
  const layers = [React.useRef<HTMLSpanElement>(null), React.useRef<HTMLSpanElement>(null)];
  const reducedMotion = useReducedMotion();

  useGSAP(
    (_context, contextSafe) => {
      const front = layers[0].current;
      const back = layers[1].current;
      if (!front || !back || reducedMotion) return;
      let index = 0;
      let showing = 0;
      let stopped = false;

      const flip = contextSafe!(() => {
        if (stopped) return;
        if (document.hidden) {
          gsap.delayedCall(rotation.hidden, flip);
          return;
        }
        const current = layers[showing].current!;
        const next = layers[1 - showing].current!;
        index = (index + 1) % ROLES.length;
        const arriving = paint(next, ROLES[index]);
        const timeline = gsap.timeline({
          defaults: { ease: "power3.inOut", duration: rotation.flip },
          onComplete: () => {
            current.replaceChildren();
            showing = 1 - showing;
            if (!stopped) gsap.delayedCall(rotation.hold, flip);
          },
        });
        timeline
          .to([...current.children], { rotateX: -90, opacity: 0, stagger: 0.02 }, 0)
          .fromTo(arriving, { rotateX: 90, opacity: 0 }, { rotateX: 0, opacity: 1, stagger: 0.02 }, 0.12);
      });

      paint(front, ROLES[index]);
      gsap.delayedCall(rotation.hold, flip);
      return () => {
        stopped = true;
        front.textContent = ROLES[0];
        back.replaceChildren();
      };
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <React.Fragment>
      <span className="role-rotator" aria-hidden="true">
        <span className="role-layer" ref={layers[0]}>
          {ROLES[0]}
        </span>
        <span className="role-layer" ref={layers[1]} />
      </span>
      <span className="visually-hidden">{ROLES.join(", ")} engineering</span>
    </React.Fragment>
  );
}
