import * as React from 'react';
import { primaryCredentials, additionalCredential } from './credentials';

export function Certifications() {
  return <React.Fragment>
    <section id="certifications" className="section wrap" aria-labelledby="certifications-title">
      <p className="eyebrow">Certifications</p>
      <h2 id="certifications-title">Validated across cloud, infrastructure, and Kubernetes.</h2>
      <ul className="certification-grid">
        {primaryCredentials.map(credential => <li key={credential.title}>
          <p className="eyebrow">{credential.issuer}</p>
          <h3>{credential.title}</h3>
          <a className="text-link metadata" href={credential.url} aria-label={`View ${credential.title} credential`}>View credential <span aria-hidden="true">↗</span></a>
        </li>)}
      </ul>
      <p className="secondary-credential"><span>Additional training</span><a className="text-link" href={additionalCredential.url}>{additionalCredential.title} ↗</a></p>
    </section>
  </React.Fragment>;
}
