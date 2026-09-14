import * as React from 'react';
import { primaryCredentials } from './credentials';

export function CredentialStrip() {
  return <React.Fragment>
    <ul className="credential-strip wrap" aria-label="Primary certifications">
      {primaryCredentials.map(credential => <li key={credential.title}>
        <span>{credential.issuer}</span><p>{credential.title}</p>
      </li>)}
    </ul>
    <section className="capabilities wrap" aria-labelledby="capabilities-title">
      <p className="eyebrow">Capabilities</p>
      <h2 id="capabilities-title">Engineering across infrastructure, delivery, and applications.</h2>
      <ul><li>Cloud Infrastructure</li><li>Platform &amp; DevOps</li><li>Kubernetes &amp; Linux</li><li>Software Engineering</li></ul>
    </section>
  </React.Fragment>;
}
