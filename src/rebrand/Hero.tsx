import * as React from 'react';
import { profile } from './profile';
import { Signature } from './Signature';
import { InfrastructureVisual } from './InfrastructureVisual';

export function Hero() {
  return <React.Fragment>
    <section id="home" className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">{profile.role} <span>· Cloud / Platform / DevOps</span></p>
        <h1 id="hero-title">{profile.headline}</h1>
        <p className="introduction">{profile.introduction}</p>
        <div className="actions">
          <a className="button primary" href="#work">View Engineering Work <span aria-hidden="true">↘</span></a>
          <a className="button secondary" href="#resume-note">View Résumé <span aria-hidden="true">↗</span></a>
        </div>
        <div className="hero-meta"><p className="metadata">{profile.location}</p>
          <a href={profile.github}>GitHub ↗</a><a href={profile.writing}>Dev.to ↗</a>
        </div>
      </div>
      <InfrastructureVisual />
      <div className="hero-foot"><Signature /><a href="#work">Selected work below ↓</a></div>
    </section>
  </React.Fragment>;
}
