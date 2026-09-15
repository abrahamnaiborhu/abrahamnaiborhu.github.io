import { profile } from './rebrand/profile';
import { Hero } from './rebrand/Hero';
import { CredentialStrip } from './rebrand/CredentialStrip';
import { Navigation } from './rebrand/Navigation';
import { Projects } from './rebrand/Projects';
import { CapabilityGrid } from './rebrand/CapabilityGrid';
import { Experience } from './rebrand/Experience.tsx';
import { Certifications } from './rebrand/Certifications';
import { Writing } from './rebrand/Writing';

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
        <Experience />
        <Certifications />
        <Writing />
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
