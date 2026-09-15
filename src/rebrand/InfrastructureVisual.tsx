import * as React from "react";
import { gsap, useGSAP } from "./motion";
import { useReducedMotion } from "./useReducedMotion";

const nodes = [
  { label: "github", x: 116, y: 18 },
  { label: "ci/cd", x: 116, y: 108 },
  { label: "terraform", x: 12, y: 226 },
  { label: "image", x: 220, y: 226 },
  { label: "gcp", x: 12, y: 316 },
  { label: "kubernetes", x: 220, y: 316 },
];

// Ambient pass: the trunk and one randomly chosen branch draw, hold, then clear.
// Values stay slow and low-contrast so the loop reads as a signal, not a banner animation.
const ambient = {
  draw: 0.55,
  overlap: 0.75,
  hold: 0.7,
  fade: 0.5,
  minGap: 1.6,
  maxGap: 3.4,
  offscreenRecheck: 1.2,
} as const;

export function InfrastructureVisual() {
  const scope = React.useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    (_context, contextSafe) => {
      const element = scope.current;
      if (!element || reducedMotion) return;
      // One 1.08s entrance sequence. No stroke painting or scroll pinning here.
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      const entranceFlows = '.flow-emphasis[data-flow="trunk"], .flow-emphasis[data-flow="left"]';
      timeline
        .set(element, { attr: { "data-motion-state": "running" } }, 0)
        .fromTo(
          element,
          { y: 8, opacity: 0.85 },
          { y: 0, opacity: 1, duration: 0.5, clearProps: "transform,opacity" },
          0,
        )
        .fromTo(
          ".topology-node",
          { opacity: 0.75 },
          { opacity: 1, duration: 0.4, stagger: 0.06, clearProps: "opacity" },
          0.1,
        )
        .to(entranceFlows, { opacity: 0.9, duration: 0.18, stagger: 0.15 }, 0.2)
        .to(entranceFlows, { opacity: 0, duration: 0.22, stagger: 0.12 }, 0.62)
        .set(
          element,
          { attr: { "data-motion-state": "complete", "data-ambient": "running" } },
          1.08,
        );

      // The ambient loop redraws a random branch every few seconds. It is idle while the
      // figure is off-screen or the tab is hidden, so a backgrounded page does no work.
      let onScreen = true;
      let stopped = false;
      let repeats: string[] = [];
      const flows = (flow: string) =>
        gsap.utils.toArray<SVGPathElement>(
          element.querySelectorAll(`.flow-emphasis[data-flow="${flow}"]`),
        );

      // Random side each pass, but never a third identical one: a long same-side run reads as stuck.
      const nextBranch = () => {
        const forced = repeats.length === 2 && repeats[0] === repeats[1];
        const branch = forced
          ? repeats[0] === "left"
            ? "right"
            : "left"
          : gsap.utils.random(["left", "right"]);
        repeats = [...repeats, branch].slice(-2);
        return branch;
      };

      const pass = contextSafe!(() => {
        if (stopped) return;
        if (!onScreen || document.hidden) {
          gsap.delayedCall(ambient.offscreenRecheck, pass);
          return;
        }
        const segments = [...flows("trunk"), ...flows(nextBranch())];
        const cycle = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          onComplete: () => {
            if (!stopped) gsap.delayedCall(gsap.utils.random(ambient.minGap, ambient.maxGap), pass);
          },
        });
        segments.forEach((segment, index) => {
          const length = segment.getTotalLength();
          cycle.fromTo(
            segment,
            { strokeDasharray: length, strokeDashoffset: length, opacity: 0.9 },
            { strokeDashoffset: 0, duration: ambient.draw },
            index * ambient.draw * ambient.overlap,
          );
        });
        cycle.to(
          segments,
          {
            opacity: 0,
            duration: ambient.fade,
            clearProps: "strokeDasharray,strokeDashoffset,opacity",
          },
          `+=${ambient.hold}`,
        );
      });

      const observer =
        typeof IntersectionObserver === "undefined"
          ? null
          : new IntersectionObserver(
              (entries) => {
                onScreen = entries.some((entry) => entry.isIntersecting);
              },
              { threshold: 0.2 },
            );
      observer?.observe(element);
      gsap.delayedCall(1.08 + ambient.minGap, pass);

      return () => {
        stopped = true;
        observer?.disconnect();
      };
    },
    { scope, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <figure
      ref={scope}
      className="topology flex justify-center w-full"
      data-motion-state="static"
      data-ambient="idle"
    >
      <figcaption>
        <span>01 / Delivery system</span>
      </figcaption>
      <svg
        viewBox="0 0 360 376"
        role="img"
        aria-label="Conceptual delivery system: GitHub feeds CI/CD, branching through Terraform to Google Cloud and through a container image to Kubernetes. Not a deployed-system or live-health claim."
      >
        <g fill="none" className="diagram-wire">
          <path d="M180 66V108 M180 156V192H76V226 M180 192H284V226 M76 274V316 M284 274V316" />
        </g>
        <g fill="none" className="diagram-accent" aria-hidden="true">
          <path className="flow-emphasis" data-flow="trunk" d="M180 66V108" />
          <path className="flow-emphasis" data-flow="left" d="M180 156V192H76V226" />
          <path className="flow-emphasis" data-flow="left" d="M76 274V316" />
          <path className="flow-emphasis" data-flow="right" d="M180 156V192H284V226" />
          <path className="flow-emphasis" data-flow="right" d="M284 274V316" />
        </g>
        {nodes.map(({ label, x, y }) => (
          <g className="topology-node" key={label} transform={`translate(${x} ${y})`}>
            <rect width="128" height="48" rx="8" />
            <text x="64" y="29" textAnchor="middle">
              {label}
            </text>
          </g>
        ))}
        <circle
          cx="180"
          cy="192"
          r="3"
          fill="currentColor"
          className="diagram-junction"
          aria-hidden="true"
        />
      </svg>
      <p className="diagram-note">
        From source to infrastructure.
        <br />
        Repeatable by design.
      </p>
    </figure>
  );
}
