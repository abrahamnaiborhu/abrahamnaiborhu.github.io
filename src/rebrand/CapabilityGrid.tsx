import * as React from 'react';
import { capabilities } from './capabilities';

export function CapabilityGrid() {
  return <React.Fragment>
    <section id="capabilities" className="capabilities wrap" aria-labelledby="capabilities-title">
      <p className="eyebrow">Capabilities</p>
      <h2 id="capabilities-title">Engineering across infrastructure, delivery, and applications.</h2>
      <p className="capability-intro">A software-engineering foundation combined with hands-on cloud infrastructure, Kubernetes administration, Infrastructure as Code, and automated delivery.</p>
      <ul className="capability-grid">
        {capabilities.map(group => <li key={group.title}>
          <h3>{group.title}</h3>
          <p>{group.technologies.join(' · ')}</p>
        </li>)}
      </ul>
    </section>
  </React.Fragment>;
}
