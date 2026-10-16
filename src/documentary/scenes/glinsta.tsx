import { drawn, ease, fixed, segment, swap, type Parts, type SceneDefinition } from './types';

// Payment reaches the worker and step 1 completes → step 2 fails and the
// account link is cut → the worker retries, every step completes, one account.
function parts(p: number): Parts {
  const paid = segment(p, 0.04, 0.12);
  const toWorker = segment(p, 0.12, 0.2);
  const step1 = segment(p, 0.2, 0.28);
  const fail = ease(segment(p, 0.4, 0.48));
  const cut = ease(segment(p, 0.44, 0.52));
  const retry = segment(p, 0.6, 0.68);
  const clear = ease(segment(p, 0.66, 0.7));
  const step2 = segment(p, 0.68, 0.74);
  const step3 = segment(p, 0.74, 0.78);
  const rejoin = ease(segment(p, 0.76, 0.82));
  const account = swap(p, 0.82, 0.88);
  const gap = cut * (1 - rejoin);
  const half = 15 * gap;
  return {
    paid: drawn(paid),
    toWorker: drawn(toWorker),
    step1: drawn(step1),
    stepFail: { opacity: fixed(fail * (1 - clear)) },
    step2: drawn(step2),
    step3: drawn(step3),
    retry: drawn(retry),
    retryLabel: { opacity: fixed(retry) },
    linkLeft: { d: `M365 180H${fixed(398 - half)}` },
    linkRight: { d: `M${fixed(398 + half)} 180H430` },
    linkSignal: drawn(rejoin),
    cut: { opacity: fixed(gap), transform: `translate(398 180) scale(${fixed(0.4 + 0.6 * gap)}) translate(-398 -180)` },
    count0: { opacity: fixed(0.35 * account.out) },
    count1: { opacity: fixed(account.in) },
  };
}

function Drawing({ a }: { a: Parts }) {
  return <>
    <rect className="s-panel" x="40" y="96" width="130" height="168" rx="5" />
    <text className="s-num s-paid" x="105" y="150" fontSize="26" textAnchor="middle">Paid</text>
    <path data-part="paid" className="s-strong" d="M84 196L98 210L126 180" pathLength={1} strokeDasharray="1" {...a.paid} />
    <path className="s-soft" d="M170 180H235" />
    <path data-part="toWorker" className="s-line" d="M170 180H235" pathLength={1} strokeDasharray="1" {...a.toWorker} />
    <rect className="s-panel" x="235" y="116" width="130" height="128" rx="5" />
    <rect className="s-line" x="255" y="138" width="16" height="16" rx="2" /><path className="s-soft" d="M283 146H345" />
    <rect className="s-line" x="255" y="172" width="16" height="16" rx="2" /><path className="s-soft" d="M283 180H345" />
    <rect className="s-line" x="255" y="206" width="16" height="16" rx="2" /><path className="s-soft" d="M283 214H345" />
    <path data-part="step1" className="s-strong" d="M258 146L262 150L269 141" pathLength={1} strokeDasharray="1" {...a.step1} />
    <path data-part="stepFail" className="s-break" d="M257 174L269 186M269 174L257 186" {...a.stepFail} />
    <path data-part="step2" className="s-strong" d="M258 180L262 184L269 175" pathLength={1} strokeDasharray="1" {...a.step2} />
    <path data-part="step3" className="s-strong" d="M258 214L262 218L269 209" pathLength={1} strokeDasharray="1" {...a.step3} />
    <path data-part="retry" className="s-line" d="M262 104A44 26 0 0 1 338 104L330 96M338 104L328 110" pathLength={1} strokeDasharray="1" {...a.retry} />
    <text data-part="retryLabel" className="s-label" x="300" y="70" textAnchor="middle" {...a.retryLabel}>Retry</text>
    <path data-part="linkLeft" className="s-line" {...a.linkLeft} /><path data-part="linkRight" className="s-line" {...a.linkRight} />
    <path data-part="linkSignal" className="s-strong" d="M365 180H430" pathLength={1} strokeDasharray="1" {...a.linkSignal} />
    <g data-part="cut" {...a.cut}><path className="s-break" d="M388 170L408 190M408 170L388 190" /></g>
    <rect className="s-panel" x="430" y="96" width="130" height="168" rx="5" />
    <path className="s-line" d="M454 122H536V170H454ZM454 122L495 152L536 122" />
    <text data-part="count0" className="s-num" x="495" y="238" fontSize="44" textAnchor="middle" {...a.count0}>0</text>
    <text data-part="count1" className="s-num" x="495" y="238" fontSize="44" textAnchor="middle" {...a.count1}>1</text>
    <text className="s-label" x="105" y="300" textAnchor="middle">Payment</text>
    <text className="s-label" x="300" y="300" textAnchor="middle">Worker</text>
    <text className="s-label" x="495" y="300" textAnchor="middle">Accounts</text>
  </>;
}

export const glinstaScene: SceneDefinition = {
  id: 'glinsta',
  states: ['start', 'fail', 'recover'],
  thresholds: [0.38, 0.62],
  settled: [0.34, 0.54, 0.9],
  captions: [
    'A business pays. A background worker sets up its Google Workspace account.',
    'A setup step fails halfway.',
    'The worker retries safely. One payment, exactly one account.',
  ],
  alts: [
    'A paid receipt flows into a worker; the first setup step is done.',
    'The second step fails and the connection to the account is cut; zero accounts.',
    'The worker retries; all steps complete and exactly one account exists.',
  ],
  parts,
  Drawing,
};
