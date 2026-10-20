import { drawn, ease, fixed, segment, swap, type Parts, type SceneDefinition } from './types';

// Payment reaches the worker and step 1 completes → step 2 fails and the
// account link is cut → the worker retries, every step completes, one account.
function parts(p: number): Parts {
  const paid = segment(p, 0.04, 0.12);
  const toWorker = segment(p, 0.12, 0.2);
  const step1 = segment(p, 0.2, 0.28);
  const fail = ease(segment(p, 0.4, 0.48));
  const retry = segment(p, 0.6, 0.68);
  const clear = ease(segment(p, 0.66, 0.7));
  const step2 = segment(p, 0.68, 0.74);
  const step3 = segment(p, 0.74, 0.78);
  const account = swap(p, 0.82, 0.88);
  return {
    paid: drawn(paid),
    toWorker: drawn(toWorker),
    step1: drawn(step1),
    stepFail: { opacity: fixed(fail * (1 - clear)) },
    step2: drawn(step2),
    step3: drawn(step3),
    retry: drawn(retry),
    retryLabel: { opacity: fixed(retry) },
    accountSurface: { transform:`translate(360 ${fixed(38-18*ease(segment(p,.82,.9)))}) rotate(${fixed(5*(1-ease(segment(p,.82,.9))))} 96 102)` },
    count0: { opacity: fixed(0.35 * account.out) },
    count1: { opacity: fixed(account.in) },
  };
}

function Drawing({ a }: { a: Parts }) {
  return <>
    <path d="M40 327H560" className="product-art-hairline"/>
    <g transform="translate(66 36) rotate(-7 104 134)">
      <rect x="4" y="8" width="208" height="268" className="product-art-shadow"/>
      <path d="M0 0H208V268L195 260 182 268 169 260 156 268 143 260 130 268 117 260 104 268 91 260 78 268 65 260 52 268 39 260 26 268 13 260 0 268Z" className="product-art-screen"/>
      <text x="20" y="30" className="product-art-small">PAYMENT RECEIVED</text><path d="M20 43H188" className="product-art-hairline"/>
      <text x="20" y="110" className="product-receipt-title">PAID.</text>
      <path data-part="paid" d="M28 148L40 160L65 132" className="s-strong" pathLength="1" strokeDasharray="1" {...a.paid}/>
      <path d="M20 193H184M20 208H157M20 223H174" className="product-art-hairline"/>
    </g>
    <g transform="translate(244 180)">
      <rect x="4" y="5" width="176" height="130" className="product-art-shadow"/>
      <rect width="176" height="130" rx="4" className="product-art-screen"/>
      <text x="14" y="23" className="product-art-small">ACCOUNT SETUP</text>
      <path d="M0 34H176" className="product-art-hairline"/>
      {[0,1,2].map(i => <g key={i}><rect x="16" y={48+i*25} width="14" height="14" rx="2" className="product-art-hairline"/><path d={`M44 ${55+i*25}H150`} className="product-art-hairline"/><path data-part={`step${i+1}`} d={`M19 ${54+i*25}L23 ${58+i*25}L29 ${49+i*25}`} className="s-strong" pathLength="1" strokeDasharray="1" {...a[`step${i+1}`]}/></g>)}
      <path data-part="stepFail" d="M17 74L29 86M29 74L17 86" className="s-break" {...a.stepFail}/>
    </g>
    <g data-part="accountSurface" {...a.accountSurface}>
      <rect x="4" y="7" width="192" height="204" className="product-art-shadow"/>
      <rect width="192" height="204" rx="4" className="product-art-screen"/>
      <text x="16" y="26" className="product-art-small">WORKSPACE ACCOUNT</text><path d="M0 39H192" className="product-art-hairline"/>
      <text data-part="count0" x="96" y="154" textAnchor="middle" className="product-account-count" {...a.count0}>0</text>
      <text data-part="count1" x="96" y="154" textAnchor="middle" className="product-account-count" {...a.count1}>1</text>
      <text x="96" y="188" textAnchor="middle" className="product-art-small">ONE PAYMENT. ONE ACCOUNT.</text>
    </g>
    <path data-part="toWorker" d="M203 172H248V182" className="s-strong" pathLength="1" strokeDasharray="1" {...a.toWorker}/>
    <path data-part="retry" d="M286 160A31 20 0 1 1 346 160L338 151M346 160L335 165" className="s-strong" pathLength="1" strokeDasharray="1" {...a.retry}/>
    <text data-part="retryLabel" x="316" y="117" textAnchor="middle" className="product-art-small" {...a.retryLabel}>RETRY SAFELY</text>
  </>;
}

export const glinstaScene: SceneDefinition = {
  id: 'glinsta',
  states: ['start', 'fail', 'recover'],
  words: ['PAID', 'RETRY', 'ONE ACCOUNT'],
  thresholds: [0.48, 0.86],
  settled: [0.34, 0.54, 0.9],
  captions: [
    'One payment starts the account setup.',
    'Setup fails halfway. The work isn’t lost.',
    'Retry safely. Exactly one account.',
  ],
  alts: [
    'A paid receipt flows into a worker; the first setup step is done.',
    'The second step fails and the connection to the account is cut; zero accounts.',
    'The worker retries; all steps complete and exactly one account exists.',
  ],
  parts,
  Drawing,
};
