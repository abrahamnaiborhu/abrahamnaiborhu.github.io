import * as React from 'react';
import { profile } from './profile';

export function Contact() {
  return <React.Fragment>
    <section id="contact" className="section wrap contact" aria-labelledby="contact-title">
      <p className="eyebrow">Contact</p>
      <h2 id="contact-title">Let&apos;s talk about cloud, platform engineering, or infrastructure.</h2>
      <p>For professional opportunities, technical collaboration, or engineering discussions, the best ways to reach me are email or LinkedIn.</p>
      <div className="actions"><a className="button primary" href={`mailto:${profile.email}`}>Email Abraham <span aria-hidden="true">↗</span></a><a className="button secondary" href={profile.linkedin}>LinkedIn <span aria-hidden="true">↗</span></a></div>
      <p className="contact-address">{profile.email}</p>
      <div className="contact-links"><a className="text-link" href={profile.github}>GitHub <span aria-hidden="true">↗</span></a><a className="text-link" href={profile.writing}>Dev.to <span aria-hidden="true">↗</span></a></div>
      <p id="resume-note" tabIndex={-1} className="metadata">A current résumé will be added when available. You can contact me by email in the meantime.</p>
    </section>
  </React.Fragment>;
}

export function Footer() {
  return <footer className="site-footer wrap">
    <div><p>© 2026 {profile.shortName}</p><p className="metadata">{profile.name} · {profile.location}</p></div>
    <nav aria-label="Footer"><a href={profile.github}>GitHub</a><a href={profile.linkedin}>LinkedIn</a><a href={profile.writing}>Dev.to</a><a href="#home">Back to top ↑</a></nav>
  </footer>;
}
