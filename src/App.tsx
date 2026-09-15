import { Hero } from './rebrand/Hero';
import { CredentialStrip } from './rebrand/CredentialStrip';
import { Navigation } from './rebrand/Navigation';
import { Projects } from './rebrand/Projects';
import { CapabilityGrid } from './rebrand/CapabilityGrid';
import { Experience } from './rebrand/Experience.tsx';
import { Certifications } from './rebrand/Certifications';
import { Writing } from './rebrand/Writing';
import { About } from './rebrand/About';
import { Contact, Footer } from './rebrand/Contact';
import { ScrollProgress } from './rebrand/ScrollProgress';
import { TextInteractions } from './rebrand/TextInteractions';

export default function App() {
  return (
    <React.Fragment>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollProgress />
      <TextInteractions />
      <Navigation />
      <main id="main" tabIndex={-1}>
        <Hero />
        <CredentialStrip />
        <CapabilityGrid />
        <Projects />
        <Experience />
        <Certifications />
        <Writing />
        <About />
        <Contact />
      </main>
      <Footer />
    </React.Fragment>
  );
}
import * as React from 'react';
