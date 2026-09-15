import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Signature } from '../src/rebrand/Signature';
import { gsap } from '../src/rebrand/motion';
import { ProjectDiagram } from '../src/rebrand/ProjectDiagram';
import { DeliveryDiagram } from '../src/rebrand/ProjectDiagrams';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { About } from '../src/rebrand/About';
import { CapabilityGrid } from '../src/rebrand/CapabilityGrid';
import { Certifications } from '../src/rebrand/Certifications';
import { Contact } from '../src/rebrand/Contact';
import { CredentialStrip } from '../src/rebrand/CredentialStrip';
import { Experience } from '../src/rebrand/Experience';

// Development-only harness. Neither this entry nor its diagnostics enter dist.
gsap.registerPlugin(ScrollTrigger);
window.foundationTweenCount = () => gsap.globalTimeline.getChildren(true, true, false).length;
window.foundationScrollTriggerCount = () => ScrollTrigger.getAll().length;
window.foundationElementTweenCount = () => gsap.globalTimeline.getChildren(true, true, false).filter(animation => {
  const candidate = animation as unknown as { targets?: () => unknown[] };
  return candidate.targets?.().some(target => target instanceof Element) ?? false;
}).length;

function ScrollSections() {
  return <main>
    <CredentialStrip />
    <CapabilityGrid />
    <Experience />
    <Certifications />
    <About />
    <Contact />
  </main>;
}

function Harness() {
  const [visible, setVisible] = React.useState(true);
  return <React.Fragment>
    <button onClick={() => setVisible(value => !value)}>{visible ? 'Hide sample' : 'Show sample'}</button>
    {visible && (location.search === '?sections'
      ? <ScrollSections />
      : location.search === '?project'
      ? <ProjectDiagram id="delivery" title="Delivery test"><DeliveryDiagram /></ProjectDiagram>
      : <Signature />)}
  </React.Fragment>;
}
const root = document.getElementById('test-root');
if (!root) throw new Error('Missing test root');
createRoot(root).render(<React.StrictMode><Harness /></React.StrictMode>);
