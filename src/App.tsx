import { profile } from './rebrand/profile';
import { Hero } from './rebrand/Hero';
import { CredentialStrip } from './rebrand/CredentialStrip';
import { Navigation } from './rebrand/Navigation';
import { Projects } from './rebrand/Projects';
import { CapabilityGrid } from './rebrand/CapabilityGrid';

export default function App() {
  return (
    <React.Fragment>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navigation />
      <main id="main" tabIndex={-1}>
        <Hero />
        <CredentialStrip />
        <CapabilityGrid />
        <Projects />
        <section id="experience" tabIndex={-1} className="section wrap" aria-labelledby="experience-title">
          <p className="eyebrow">Experience</p>
          <h2 id="experience-title">From software engineering to cloud and platform ownership.</h2>
          <h3>{profile.role}</h3>
          <p>{profile.company} · September 2025–Present · Jakarta</p>
        </section>
        <section id="writing" tabIndex={-1} className="section wrap" aria-labelledby="writing-title">
          <p className="eyebrow">Writing</p>
          <h2 id="writing-title">Documenting the engineering decisions behind the implementation.</h2>
          <a className="text-link" href={profile.writing}>Read the engineering notes on Dev.to <span aria-hidden="true">↗</span></a>
        </section>
        <section id="about" tabIndex={-1} className="section wrap" aria-labelledby="about-title">
          <p className="eyebrow">About</p>
          <h2 id="about-title">Software engineering foundations. Infrastructure focus.</h2>
          <p>I bring a software-engineering foundation to cloud infrastructure, delivery systems, and platform reliability.</p>
        </section>
        <section id="contact" className="section wrap" aria-labelledby="contact-title">
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title">Let&apos;s talk about cloud, platform engineering, or infrastructure.</h2>
          <a className="text-link" href={`mailto:${profile.email}`}>{profile.email} <span aria-hidden="true">↗</span></a>
          <p id="resume-note" tabIndex={-1} className="metadata">A current résumé will be added when available. You can contact me by email in the meantime.</p>
        </section>
      </main>
      <footer className="site-footer wrap"><p>{profile.name}</p><a href="#home">Back to top ↑</a></footer>
    </React.Fragment>
  );
}
import * as React from 'react';
