/** One release stays in view as the work changes around it. SVG geometry is driven by the chapter's scroll owner. */
export function PlatformPayoff() {
  return <div className="platform-payoff" aria-hidden="true">
    <div className="payoff-words">{['CHANGE','BUILD','SYNC','RUN','TOGETHER'].map((word,i) => <span key={word} data-payoff-word={i}>{word}</span>)}</div>
    <svg viewBox="0 0 800 420" focusable="false">
      <defs><pattern id="payoff-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="currentColor" strokeWidth=".5" /></pattern></defs>
      <rect data-payoff="foundation" x="20" y="40" width="760" height="340" rx="2" fill="url(#payoff-grid)" opacity="0" />
      {Array.from({length:9},(_,i) => <g key={i} data-payoff-peer={i} opacity="0"><rect x="-58" y="-42" width="116" height="84" rx="3" className="payoff-paper"/><path d="M-58-20H58M-43-31H-28M-21-31H-17M-40 0H26M-40 15H40M-40 30H12" className="payoff-line" /></g>)}
      <g data-payoff="config" opacity="0"><rect x="120" y="70" width="560" height="280" className="payoff-paper"/><path d="M120 112H680" className="payoff-line"/><text x="146" y="98" className="payoff-label">DEPLOYMENT CONFIGURATION</text><text x="146" y="154" className="payoff-code">image:</text><path d="M146 214H640M146 246H580M146 278H620" className="payoff-muted"/><text x="146" y="324" className="payoff-label">DECLARED STATE / ARGO CD</text></g>
      <g data-payoff="runtime" opacity="0"><path d="M100 88V48H700V88M100 332V372H700V332" className="payoff-line"/><text x="400" y="35" textAnchor="middle" className="payoff-label">KUBERNETES / RUNNING APPLICATION</text><path data-payoff="trace" d="M130 338H232L250 310 268 350 286 326H350L368 300 386 338H670" className="payoff-line payoff-trace" pathLength="1" strokeDasharray="1" strokeDashoffset="1"/></g>
      <g data-payoff="release" data-release-actor="true">
        <path data-payoff="left-fold" d="M210 110H140V310H210Z" className="payoff-paper" opacity="0"/>
        <path data-payoff="right-fold" d="M590 110H660V310H590Z" className="payoff-paper" opacity="0"/>
        <rect x="210" y="110" width="380" height="200" rx="3" className="payoff-paper"/>
        <path d="M210 150H590" className="payoff-line"/>
        <text x="230" y="136" className="payoff-label">ONE DEVELOPER’S CHANGE</text>
        <g data-payoff="code"><text x="238" y="195" className="payoff-code">+ improve application</text><path d="M238 220H520M238 245H450M238 270H490" className="payoff-line"/></g>
        <g data-payoff="image" opacity="0"><path d="M358 183L400 161 442 183V231L400 254 358 231ZM358 183L400 207 442 183M400 207V254" className="payoff-line"/><text x="400" y="282" textAnchor="middle" className="payoff-label">CONTAINER IMAGE</text></g>
        <g data-payoff="app" opacity="0"><rect x="236" y="172" width="328" height="110" className="payoff-line"/><path d="M254 194H378M254 216H510M254 238H460M254 260H340" className="payoff-line"/></g>
      </g>
      <g data-payoff="version" opacity="0"><rect x="0" y="0" width="228" height="44" className="payoff-ink"/><text x="114" y="28" textAnchor="middle" className="payoff-version">COMMIT SHA / VERSION</text></g>
      <g data-payoff="scope" opacity="0"><text x="400" y="28" textAnchor="middle" className="payoff-label">ONE SHARED FOUNDATION</text><text x="400" y="411" textAnchor="middle" className="payoff-label">DEVELOPMENT / STAGING</text></g>
    </svg>
    <div className="payoff-scope" data-payoff="scope-copy"><span><strong>10</strong> applications</span><span><strong>~11</strong> developers</span></div>
  </div>;
}
