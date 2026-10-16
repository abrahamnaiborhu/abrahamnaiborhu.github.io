import { ArrowIcon } from '../components/ArrowIcon';
import { useIllustrationMotion } from './useIllustrationMotion';
import { AccessIllustration, AvadIllustration, GlinstaIllustration } from './ProjectIllustrations';

export function Applications() {
  const ref = useIllustrationMotion();
  return (<section ref={ref} data-visible="false" id="work" tabIndex={-1} className="scene scene-applications" aria-labelledby="applications-title">
        <div className="scene-top"><span>Application experience</span><span>Selected product work</span></div>
        <div className="illustration-controls"><label><input id="project-motion" type="checkbox" defaultChecked /> Animate project illustrations</label><span className="reduced-motion-note">Completed illustrations · reduced motion</span></div><div className="applications-main">
          <div className="narration"><h2 id="applications-title">My foundation<br />is building<br /><em>applications.</em></h2><p>My work spans mobile, web, desktop, enterprise ERP, IoT and machine learning.</p><p>For Sattabi, Glinsta and AVAD, I was responsible for end-to-end engineering—from design and development to deployment and monitoring.</p></div>
          <div className="product-gallery" aria-label="Employer-owned projects I engineered end to end">
            <figure className="product-plate product-primary"><AccessIllustration /><figcaption><a href="https://sattabi.com/">Sattabi <ArrowIcon /></a><span>Access management</span></figcaption></figure>
            <figure className="product-plate product-support"><AvadIllustration /><figcaption><a href="https://avad-online.com/">AVAD <ArrowIcon /></a><span>Presentation platform</span></figcaption></figure>
            <figure className="product-plate product-support"><GlinstaIllustration /><figcaption><a href="https://glinsta.com/">Glinsta <ArrowIcon /></a><span>Workspace purchasing</span></figcaption></figure>
          </div>
        </div>
        <div className="application-context">
          <p className="attribution-line">Employer-owned products · My role: end-to-end engineering</p>
          <p className="ownership-line">Design <span><ArrowIcon direction="right" /></span> Development <span><ArrowIcon direction="right" /></span> Deployment <span><ArrowIcon direction="right" /></span> Monitoring</p>
          <p className="context-label">The software foundation behind that work</p>
          <ol className="career-line"><li><span>2022–2023 / Mattel</span><strong>Software Engineer Intern</strong></li><li><span>2023–2024 / Indomaret</span><strong>VB.NET Developer</strong></li><li><span>2024–2025 / HAND Global Solutions</span><strong>Oracle NetSuite Technical Consultant</strong></li></ol>
          <p className="range-line">Mobile <span>/</span> Web <span>/</span> Desktop <span>/</span> ERP <span>/</span> IoT <span>/</span> Machine learning</p>
        </div>
      </section>);
}

export function Perspective() {
  return (<section id="perspective" tabIndex={-1} className="scene story-perspective" aria-labelledby="perspective-title">
  <div className="scene-top"><span>The connection</span><span>Application experience <ArrowIcon direction="right" /> Platform work</span></div>
  <div className="perspective-main"><div className="narration"><h2 id="perspective-title">I care about<br />how the parts<br /><em>work together.</em></h2><p>Taking responsibility for deployment and monitoring made me think beyond the application itself.</p><p>I want the whole system to feel seamless—and I keep asking what can still work when something fails.</p></div>
  <dl className="responsibility-detail"><div><dt>Delivering a change</dt><dd>How does an application change become a container build and a deployment?</dd></div><div><dt>Running the application</dt><dd>How do networking, configuration and storage support the application?</dd></div><div><dt>Planning for failure</dt><dd>What needs a fallback? How can we recover within the resources available?</dd></div></dl></div>
  <p className="perspective-bridge">I put that perspective into practice by building a shared development and staging platform for my peers.</p>
</section>);
}

export function Judgment() {
  return (<section id="judgment" tabIndex={-1} className="scene failure-scene" aria-labelledby="failure-title">
        <div className="scene-top"><span>Engineering judgment</span><span>Reliability within constraints</span></div>
        <div className="failure-heading"><div className="narration"><h2 id="failure-title">I keep asking:<br /><em>what if this fails?</em></h2></div><p>High availability has a cost. When the ideal design is out of reach, I still look for practical fallback paths and think through recovery.</p></div>
        <figure className="fallback-study"><svg viewBox="0 0 1000 300" role="img" aria-labelledby="fallback-title fallback-desc"><title id="fallback-title">A conceptual fallback path</title><desc id="fallback-desc">A primary path is interrupted. A separate curved fallback path connects the same two endpoints. This is a visual explanation of a design question, not an employer architecture.</desc><g fill="none" stroke="currentColor" strokeWidth="2"><rect x="32" y="108" width="190" height="76"/><rect x="778" y="108" width="190" height="76"/><path d="M222 146H450M550 146H778"/><path d="M222 158C335 290 665 290 778 158" strokeDasharray="8 8"/><path d="M480 126L520 166M520 126L480 166"/></g><g fill="currentColor" fontFamily="Helvetica,Arial,sans-serif" textAnchor="middle"><text x="127" y="152" fontSize="19">Request</text><text x="873" y="152" fontSize="19">Service</text><text x="500" y="95" fontSize="14">Primary path interrupted</text><text x="500" y="282" fontSize="14">A fallback to consider</text></g></svg><div className="mobile-fallback"><p>Request</p><div><span>Primary path</span><strong>Interrupted ×</strong></div><div className="alternate-path"><span>Fallback path</span><strong>Another route to consider <ArrowIcon direction="down" /></strong></div><p>Service</p></div><figcaption>Conceptual fallback study</figcaption></figure>
        <div className="judgment-lines"><p>What can keep working?</p><p>What can we recover?</p><p>What can we afford?</p></div>
      </section>);
}

export function Contact() {
  return (<section id="contact" tabIndex={-1} className="scene next-scene contact" aria-labelledby="contact-title">
        <div className="scene-top"><span>The next team</span><span>Abraham Naiborhu · Jakarta</span></div>
        <div className="closing-main"><p className="closing-premise">I like making things work together.</p><h2 id="contact-title">What could<br />we build<br /><em>together?</em></h2><p className="closing-focus">Cloud Engineer / Platform Engineer / DevOps Engineer</p><p className="closing-copy">I bring an application developer’s perspective to the infrastructure and delivery systems that support the work. If that fits your team, let’s talk.</p><a className="email-link" aria-label="Email Abraham" href="mailto:abrahamnaiborhu@gmail.com">abrahamnaiborhu@gmail.com <ArrowIcon /></a></div>
        <div className="closing-links"><a href="https://www.linkedin.com/in/abrahamnaiborhu">LinkedIn <ArrowIcon /></a><a href="https://github.com/abrahamnaiborhu">GitHub <ArrowIcon /></a><a href="https://dev.to/abrahamnaiborhu">Dev.to <ArrowIcon /></a><a href="/resume.html">Read my resume <ArrowIcon /></a><a id="resume-note" href="/Abraham-Naiborhu-Resume.pdf" download>Resume PDF <ArrowIcon direction="down" /></a><a href="#work">Revisit the work <ArrowIcon /></a></div>
      </section>);
}
