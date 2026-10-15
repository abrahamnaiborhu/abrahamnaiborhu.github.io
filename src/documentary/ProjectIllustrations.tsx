import { useId } from 'react';

export function AccessIllustration() {
  const titleId = useId();
  return (<svg className="product-art sattabi-art" viewBox="0 0 600 360" role="img" aria-labelledby={titleId}><title id={titleId}>A card taps the reader, access is granted, the overhead controller responds and the door opens</title><g fill="none" strokeLinecap="round" strokeLinejoin="round">
  <path className="art-line art-soft-line" d="M66 316H540"/>
  <path className="art-line" d="M332 316V100H492V316"/>
  <g className="art-motion access-gate" transform="translate(484 212) skewY(-8) scale(.22 1) translate(-484 -212)"><rect className="art-panel panel" x="340" y="108" width="144" height="208"/><path className="art-line" d="M462 206V226"/></g>
  <rect className="art-panel panel" x="226" y="184" width="42" height="64" rx="4"/>
  <rect className="art-line" x="233" y="193" width="28" height="29" rx="2"/>
  <path className="art-line art-soft-line" d="M238 235H256"/>
  <path className="art-line art-soft-line" d="M247 184V72H382M418 86V100"/>
  <rect className="art-panel panel" x="382" y="56" width="72" height="30" rx="3"/>
  <path className="art-line" d="M390 65H402M390 73H402"/>
  <g className="art-motion access-controller"><rect className="art-solid" x="414" y="64" width="12" height="14" rx="1"/><path className="art-line art-accent accent" d="M418 86V100"/></g>
  <path className="art-motion access-route art-line art-accent accent" pathLength="1" d="M247 184V72H382"/>
  <path className="art-motion access-check art-line art-accent accent" pathLength="1" d="M238 208L245 214L255 201"/>
  <g className="art-motion access-card" transform="translate(62 0)"><rect className="art-panel panel" x="90" y="200" width="68" height="44" rx="4"/><path className="art-line" d="M102 214H126M102 224H142M102 234H116"/></g>
</g><g className="access-labels" fill="currentColor" fontFamily="Helvetica,Arial,sans-serif" fontSize="15" textAnchor="middle"><text x="418" y="43">Controller</text><text x="216" y="178" textAnchor="end">Reader</text></g></svg>);
}

export function AvadIllustration() {
  const titleId = useId();
  return (<svg className="product-art avad-art" viewBox="0 0 600 360" role="img" aria-labelledby={titleId}><title id={titleId}>Conceptual illustration of one presentation updating multiple screens</title><g fill="none" strokeLinecap="round" strokeLinejoin="round"><rect className="art-panel" x="48" y="104" width="276" height="174" rx="5"/><path className="art-line" d="M186 278V304M132 304H240"/>
        <rect className="art-panel" x="394" y="64" width="158" height="106" rx="4"/><rect className="art-panel" x="394" y="204" width="158" height="106" rx="4"/>
        <path className="art-line art-soft-line" d="M338 191H366V117H382M366 191V257H382"/><g transform="translate(82 143)"><g className="art-motion slide-a"><rect className="art-solid" width="112" height="12" rx="3"/><path className="art-line" d="M0 34H168M0 50H136M0 66H152"/></g><g className="art-motion slide-b"><rect className="art-accent-fill" width="148" height="12" rx="3"/><path className="art-line" d="M0 34H124M0 50H162M0 66H106"/></g></g><g transform="translate(416 86) scale(.64)"><g className="art-motion slide-a"><rect className="art-solid" width="112" height="12" rx="3"/><path className="art-line" d="M0 34H168M0 50H136M0 66H152"/></g><g className="art-motion slide-b"><rect className="art-accent-fill" width="148" height="12" rx="3"/><path className="art-line" d="M0 34H124M0 50H162M0 66H106"/></g></g><g transform="translate(416 226) scale(.64)"><g className="art-motion slide-a"><rect className="art-solid" width="112" height="12" rx="3"/><path className="art-line" d="M0 34H168M0 50H136M0 66H152"/></g><g className="art-motion slide-b"><rect className="art-accent-fill" width="148" height="12" rx="3"/><path className="art-line" d="M0 34H124M0 50H162M0 66H106"/></g></g></g></svg>);
}

export function GlinstaIllustration() {
  const titleId = useId();
  return (<svg className="product-art glinsta-art" viewBox="0 0 600 360" role="img" aria-labelledby={titleId}><title id={titleId}>Conceptual illustration of setting up a digital workspace</title><g fill="none" strokeLinecap="round" strokeLinejoin="round"><rect className="art-panel" x="54" y="80" width="224" height="218" rx="5"/><path className="art-line" d="M76 108H178M76 124H144"/>
        <rect className="art-line" x="76" y="154" width="180" height="36" rx="3"/><path className="art-line art-soft-line" d="M90 172H206"/>
        <rect className="art-motion workspace-select art-accent-fill" x="76" y="214" width="180" height="36" rx="3"/><path className="art-line" d="M90 232H208"/>
        <path className="art-motion workspace-route art-line art-accent" pathLength="1" d="M294 190H350"/>
        <g className="art-motion workspace-mail"><rect className="art-panel" x="374" y="110" width="178" height="158" rx="5"/><rect className="art-line" x="398" y="140" width="130" height="88" rx="3"/><path className="art-line" d="M398 142L463 190L528 142"/></g>
        <path className="art-motion workspace-check art-line art-accent" pathLength="1" d="M440 290L454 304L482 274"/></g></svg>);
}
