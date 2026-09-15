import * as React from "react";
import { profile } from "./profile";
import { Signature } from "./Signature";
import { InfrastructureVisual } from "./InfrastructureVisual";
import { gsap, useGSAP } from "./motion";
import { useReducedMotion } from "./useReducedMotion";
import { RoleRotator } from "./RoleRotator";

export function Hero() {
  const scope = React.useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const entered = React.useRef(false);

  // Staggered entrance per rebrand §35. Content starts visible; this is enhancement.
  useGSAP(
    () => {
      const el = scope.current;
      if (!el || reducedMotion || entered.current) return;
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", clearProps: "opacity,transform" },
        onStart: () => {
          entered.current = true;
        },
      });
      tl.from(el.querySelector(".eyebrow"), { opacity: 0.85, y: 14, duration: 0.45 })
        .from(el.querySelector(".introduction"), { opacity: 0.85, y: 18, duration: 0.55 }, "-=0.35")
        .from(el.querySelector(".actions"), { opacity: 0.85, y: 14, duration: 0.45 }, "-=0.30")
        .from(el.querySelector(".hero-meta"), { opacity: 0.85, duration: 0.35 }, "-=0.20");
    },
    { scope, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <React.Fragment>
      <section ref={scope} id="home" className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            {profile.role} <span>·</span> <RoleRotator />
          </p>
          <h1 id="hero-title">{profile.headline}</h1>
          <p className="introduction">{profile.introduction}</p>
          <div className="actions">
            <a className="button primary" href="#work">
              View Engineering Work <span aria-hidden="true">↘</span>
            </a>
            <a className="button secondary" href={profile.resume}>
              View Resume <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero-meta">
            <p className="metadata">{profile.location}</p>
            <a href={profile.github}>GitHub ↗</a>
            <a href={profile.writing}>Dev.to ↗</a>
          </div>
        </div>
        <InfrastructureVisual />
        <div className="hero-foot">
          <Signature />
          <a href="#work">Selected work below ↓</a>
        </div>
      </section>
    </React.Fragment>
  );
}
