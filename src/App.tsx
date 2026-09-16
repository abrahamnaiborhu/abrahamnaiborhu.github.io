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

function DeferredTextInteractions() {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (typeof window.requestIdleCallback === 'function') {
      const idle = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(idle);
    }
    const timer = window.setTimeout(() => setReady(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  return ready ? <TextInteractions /> : null;
}

export default function App() {
  return (
    <React.Fragment>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollProgress />
      <DeferredTextInteractions />
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
