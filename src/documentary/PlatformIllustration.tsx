import { useId } from 'react';

export function PlatformIllustration() {
  const titleId = useId();
  return (<svg viewBox="0 0 1040 380" role="img" aria-labelledby={titleId}><title id={titleId}>A developer’s change becomes a deployed, observed application</title><desc>Source changes go through checks and a container build. The image version is recorded in deployment configuration, which Argo CD reconciles into Kubernetes. Metrics, logs and alerts provide visibility into running workloads.</desc>
<g className="workflow-drawing" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
<g className="workflow-step" data-workflow-step="source">  <path d="M64 66H154L178 90V186H64ZM154 66V90H178M86 110H152M86 130H140M86 150H152"/>
</g>
  <path d="M219 126H258M249 118L258 126L249 134"/>
<g className="workflow-step" data-workflow-step="build">  <rect x="293" y="66" width="124" height="120" rx="3"/><path d="M293 93H417M309 113L314 118L323 107M334 114H400M309 138L314 143L323 132M334 139H389M309 163L314 168L323 157M334 164H400"/>
</g>
  <path d="M459 126H498M489 118L498 126L489 134"/>
<g className="workflow-step" data-workflow-step="config">  <path d="M558 57H648V173H558ZM544 75H534V191H624V184M574 82H632M574 102H618M574 140H632M574 154H609"/>
  <rect x="574" y="115" width="58" height="12" fill="currentColor" stroke="none"/>
</g>
  <path d="M699 126H738M729 118L738 126L729 134"/>
<g className="workflow-step" data-workflow-step="runtime">  <rect x="777" y="66" width="184" height="120" rx="3"/><path d="M777 93H961M796 80H819M830 80H838M796 115H866M796 132H925M796 149H908M796 166H884"/>
</g>
  <path d="M961 126H1006V313H644" strokeDasharray="5 5"/>
  <path d="M477 333V315L495 306L513 318L531 288L549 300L567 279L585 291L603 271"/>
</g>
<g fill="currentColor" textAnchor="middle" fontFamily="Helvetica,Arial,sans-serif"><text x="121" y="230" fontSize="20">Source change</text><text x="121" y="257" fontSize="14">Developer · Git</text><text x="355" y="230" fontSize="20">Check + build</text><text x="355" y="257" fontSize="14">CI · Container image</text><text x="596" y="230" fontSize="20">Record + reconcile</text><text x="596" y="257" fontSize="14">Versioned config · Argo CD</text><text x="869" y="230" fontSize="20">Run the application</text><text x="869" y="257" fontSize="14">Kubernetes</text><text x="540" y="363" fontSize="16">Metrics · Logs · Alerts</text></g></svg>);
}
