import * as React from 'react';
import { primaryCredentials } from './credentials';

export function Certifications() {
  return <React.Fragment>
    <section id="certifications" className="section wrap" aria-labelledby="certifications-title">
      <p className="eyebrow">Certifications</p>
      <h2 id="certifications-title">Validated across cloud, infrastructure, and Kubernetes.</h2>
      <ul className="certification-grid">
        {primaryCredentials.map(credential => <li key={credential.title}>
          <p className="eyebrow">{credential.issuer}</p>
          <h3>{credential.title}</h3>
        </li>)}
      </ul>
      <p className="secondary-credential"><span>Additional training</span> AWS Academy Cloud Foundations</p>
    </section>
  </React.Fragment>;
}
