import * as React from 'react';
import { foundation, delivery, platform, type Project } from './projectData';
import { DeliveryDiagram, PlatformDiagram } from './ProjectDiagrams';
import { ProjectDiagram } from './ProjectDiagram';
import { gsap, useGSAP, reveal } from './motion';
import { useReducedMotion } from './useReducedMotion';

function ProjectCard({ project, children }: { project: Project; children: React.ReactNode }) {
  return <article className="project" aria-labelledby={`${project.id}-title`}>
    <div className="project-copy">
      <p className="eyebrow">{project.label}</p>
      <h3 id={`${project.id}-title`}>{project.title}</h3>
      <p>{project.summary}</p>
      <ul className="project-highlights">{project.highlights.map(item => <li key={item}>{item}</li>)}</ul>
      <ul className="project-technologies" aria-label="Technologies">{project.technologies.map(item => <li key={item}>{item}</li>)}</ul>
      <div className="project-links">
        {project.repository && <a className="text-link" href={project.repository} target="_blank" rel="noopener noreferrer">View repository <span aria-hidden="true">↗</span></a>}
        <a className="text-link" href={project.article} target="_blank" rel="noopener noreferrer">Read case study <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    {children}
  </article>;
}

export function Projects() {
  const scope = React.useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const entered = React.useRef(false);

  // Each project settles individually, so a long section never animates as one block.
  useGSAP(() => {
    const el = scope.current;
    if (!el || reducedMotion || entered.current) return;
    entered.current = true;
    el.querySelectorAll('.project').forEach(project => {
      gsap.from(project.querySelectorAll('.project-copy > *, .project-diagram'), {
        opacity: 0.85,
        y: reveal.y,
        duration: reveal.duration,
        ease: reveal.ease,
        stagger: reveal.stagger,
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: project, start: 'top 82%', once: true },
      });
    });
  }, { scope, dependencies: [reducedMotion], revertOnUpdate: true });

  return <section ref={scope} id="work" tabIndex={-1} className="section wrap" aria-labelledby="work-title">
    <p className="eyebrow">Selected engineering work</p>
    <h2 id="work-title">Infrastructure built to be repeatable, secure, and operable.</h2>
    <p>Selected architecture and engineering work across Google Cloud, Terraform, CI/CD, and platform reliability.</p>
    <ProjectCard project={foundation}>
      <ProjectDiagram id="foundation" title="Architecture / two-stage foundation">
        <ol className="foundation-flow">
          <li><span className="diagram-step">01 / Bootstrap</span><strong>GCS state bucket</strong><span>Object versioning · remote state</span></li>
          <li><span className="diagram-step">02 / Foundation</span><strong>Terraform root module</strong><span>Uses the bootstrapped GCS backend</span>
            <ul className="foundation-branches">
              <li><strong>Network module</strong><span>VPC · Subnets · Firewall</span></li>
              <li><strong>IAM module</strong><span>Service accounts · Role bindings</span></li>
            </ul>
          </li>
        </ol>
        <p className="diagram-note">A reusable learning foundation, not a full landing zone. Subnet names describe intended roles, not native public/private subnet types.</p>
      </ProjectDiagram>
    </ProjectCard>
    <ProjectCard project={delivery}>
      <ProjectDiagram id="delivery" title="Workflow / review and execution">
        <DeliveryDiagram />
      </ProjectDiagram>
    </ProjectCard>
    <ProjectCard project={platform}>
      <ProjectDiagram id="platform" title="Architecture / request and egress paths">
        <PlatformDiagram />
      </ProjectDiagram>
    </ProjectCard>
  </section>;
}
