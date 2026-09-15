import * as React from 'react';
import { primaryCredentials } from './credentials';

export function CredentialStrip() {
  return <React.Fragment>
    <ul className="credential-strip wrap" aria-label="Primary certifications">
      {primaryCredentials.map(credential => <li key={credential.title}>
        <span>{credential.issuer}</span><p>{credential.title}</p>
      </li>)}
    </ul>
  </React.Fragment>;
}
