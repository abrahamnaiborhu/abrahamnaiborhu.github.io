import { profile } from './rebrand/profile';
import { Signature } from './rebrand/Signature';

export default function App() {
  return (
    <React.Fragment>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header wrap">
        <a className="identity" href="#home">{profile.shortName}<span aria-hidden="true">.</span></a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a><a href="#experience">Experience</a>
          <a href="#writing">Writing</a><a href="#contact">Contact</a>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <section id="home" className="hero wrap" aria-labelledby="hero-title">
          <p className="eyebrow">{profile.role} <span>· Cloud / Platform / DevOps</span></p>
          <h1 id="hero-title">{profile.headline}</h1>
          <p className="introduction">{profile.introduction}</p>
          <div className="actions">
            <a className="button primary" href="#work">View Engineering Work <span aria-hidden="true">↘</span></a>
            <a className="button secondary" href={`mailto:${profile.email}`}>Contact me <span aria-hidden="true">↗</span></a>
          </div>
          <p className="metadata">{profile.location}</p>
          <Signature />
        </section>
        <section id="work" className="section wrap" aria-labelledby="work-title">
          <p className="eyebrow">Selected engineering work</p>
          <h2 id="work-title">Infrastructure built to be repeatable, secure, and operable.</h2>
          <p>Engineering work across Google Cloud, Terraform, CI/CD, and platform reliability.</p>
          <a className="text-link" href={profile.github}>Explore GitHub <span aria-hidden="true">↗</span></a>
        </section>
        <section id="experience" className="section wrap" aria-labelledby="experience-title">
          <p className="eyebrow">Experience</p>
          <h2 id="experience-title">From software engineering to cloud and platform ownership.</h2>
          <h3>{profile.role}</h3>
          <p>{profile.company} · September 2025–Present · Jakarta</p>
        </section>
        <section id="writing" className="section wrap" aria-labelledby="writing-title">
          <p className="eyebrow">Writing</p>
          <h2 id="writing-title">Documenting the engineering decisions behind the implementation.</h2>
          <a className="text-link" href={profile.writing}>Read the engineering notes on Dev.to <span aria-hidden="true">↗</span></a>
        </section>
        <section id="contact" className="section wrap" aria-labelledby="contact-title">
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title">Let&apos;s talk about cloud, platform engineering, or infrastructure.</h2>
          <a className="text-link" href={`mailto:${profile.email}`}>{profile.email} <span aria-hidden="true">↗</span></a>
          <p className="metadata">A current résumé will be added when available.</p>
        </section>
      </main>
      <footer className="site-footer wrap"><p>{profile.name}</p><a href="#home">Back to top ↑</a></footer>
    </React.Fragment>
  );
}
import * as React from 'react';
