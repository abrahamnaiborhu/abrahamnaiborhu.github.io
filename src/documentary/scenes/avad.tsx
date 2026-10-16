import { drawn, ease, fixed, segment, swap, type Parts, type SceneDefinition } from './types';

// Operator moves to slide 2 and both screens follow → screen B misses its ping
// while the operator and screen A move to 3 → B reconnects and catches up to 3.
function parts(p: number): Parts {
  const toTwo = swap(p, 0.06, 0.14);
  const followTwo = swap(p, 0.22, 0.3);
  const toThree = swap(p, 0.46, 0.52);
  const aThree = swap(p, 0.5, 0.54);
  const drop = ease(segment(p, 0.4, 0.46));
  const rejoin = ease(segment(p, 0.62, 0.7));
  const wake = ease(segment(p, 0.7, 0.76));
  const catchUp = segment(p, 0.83, 0.86);
  const gap = drop * (1 - rejoin);
  const dark = drop * (1 - wake);
  const half = 15 * gap;
  const signalA = p < 0.4 ? segment(p, 0.14, 0.22) * (1 - segment(p, 0.3, 0.33)) : segment(p, 0.46, 0.5) * (1 - segment(p, 0.54, 0.58));
  const signalB = p < 0.4 ? segment(p, 0.14, 0.22) * (1 - segment(p, 0.3, 0.33)) : segment(p, 0.76, 0.8) * (1 - segment(p, 0.86, 0.9));
  return {
    op1: { opacity: fixed(toTwo.out) }, op2: { opacity: fixed(toTwo.in * toThree.out) }, op3: { opacity: fixed(toThree.in) },
    a1: { opacity: fixed(followTwo.out) }, a2: { opacity: fixed(followTwo.in * aThree.out) }, a3: { opacity: fixed(aThree.in) },
    b1: { opacity: fixed(followTwo.out * (1 - dark)) }, b2: { opacity: fixed(followTwo.in * (1 - drop)) }, b3: { opacity: fixed(catchUp) },
    bDark: { opacity: fixed(dark) },
    signalA: drawn(signalA), signalB: drawn(signalB),
    bTop: { d: `M350 184V${fixed(218 - half)}` },
    bBottom: { d: `M350 ${fixed(218 + half)}V252H400` },
    cut: { opacity: fixed(gap), transform: `translate(350 218) scale(${fixed(0.4 + 0.6 * gap)}) translate(-350 -218)` },
  };
}

function Drawing({ a }: { a: Parts }) {
  return <>
    <rect className="s-panel" x="40" y="96" width="270" height="176" rx="5" /><path className="s-line" d="M175 272V298M125 298H225" />
    <rect className="s-panel" x="400" y="40" width="160" height="104" rx="4" />
    <rect className="s-panel" x="400" y="200" width="160" height="104" rx="4" />
    <text data-part="op1" className="s-num" x="175" y="210" fontSize="80" textAnchor="middle" {...a.op1}>1</text>
    <text data-part="op2" className="s-num" x="175" y="210" fontSize="80" textAnchor="middle" {...a.op2}>2</text>
    <text data-part="op3" className="s-num" x="175" y="210" fontSize="80" textAnchor="middle" {...a.op3}>3</text>
    <text data-part="a1" className="s-num" x="480" y="110" fontSize="52" textAnchor="middle" {...a.a1}>1</text>
    <text data-part="a2" className="s-num" x="480" y="110" fontSize="52" textAnchor="middle" {...a.a2}>2</text>
    <text data-part="a3" className="s-num" x="480" y="110" fontSize="52" textAnchor="middle" {...a.a3}>3</text>
    <text data-part="b1" className="s-num" x="480" y="270" fontSize="52" textAnchor="middle" {...a.b1}>1</text>
    <text data-part="b2" className="s-num" x="480" y="270" fontSize="52" textAnchor="middle" {...a.b2}>2</text>
    <text data-part="b3" className="s-num" x="480" y="270" fontSize="52" textAnchor="middle" {...a.b3}>3</text>
    <g data-part="bDark" {...a.bDark}><rect className="s-solid" x="400" y="200" width="160" height="104" rx="4" /><text className="s-inverse" x="480" y="244" textAnchor="middle">Ping</text><text className="s-inverse" x="480" y="280" textAnchor="middle">missed</text></g>
    <path className="s-line" d="M310 184H350V92H400" />
    <path data-part="bTop" className="s-line" {...a.bTop} /><path data-part="bBottom" className="s-line" {...a.bBottom} />
    <path data-part="signalA" className="s-strong" d="M310 184H350V92H400" pathLength={1} strokeDasharray="1" {...a.signalA} />
    <path data-part="signalB" className="s-strong" d="M310 184H350V252H400" pathLength={1} strokeDasharray="1" {...a.signalB} />
    <g data-part="cut" {...a.cut}><path className="s-break" d="M340 208L360 228M360 208L340 228" /></g>
    <text className="s-label" x="175" y="336" textAnchor="middle">Operator</text>
    <text className="s-label" x="470" y="336" textAnchor="middle">Shared screens</text>
  </>;
}

export const avadScene: SceneDefinition = {
  id: 'avad',
  states: ['start', 'fail', 'recover'],
  thresholds: [0.38, 0.62],
  settled: [0.34, 0.6, 0.9],
  captions: [
    'The operator changes the slide. Over WebSocket, every screen follows the moment it changes.',
    'One screen in the hall misses its ping.',
    'It reconnects and catches up to the current slide on its own.',
  ],
  alts: [
    'The operator monitor and both shared screens show slide 2.',
    'The operator is on slide 3; one shared screen is dark and its connection is cut.',
    'The connection rejoins and every screen shows slide 3.',
  ],
  parts,
  Drawing,
};
