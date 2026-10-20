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
  const signalA = p < 0.4 ? segment(p, 0.14, 0.22) * (1 - segment(p, 0.3, 0.33)) : segment(p, 0.46, 0.5) * (1 - segment(p, 0.54, 0.58));
  const signalB = p < 0.4 ? segment(p, 0.14, 0.22) * (1 - segment(p, 0.3, 0.33)) : segment(p, 0.76, 0.8) * (1 - segment(p, 0.86, 0.9));
  return {
    peerSurface: { transform:`translate(${fixed(366+20*gap)} ${fixed(35+40*gap)}) rotate(${fixed(5+10*gap)} 95 62)` },
    op1: { opacity: fixed(toTwo.out) }, op2: { opacity: fixed(toTwo.in * toThree.out) }, op3: { opacity: fixed(toThree.in) },
    a1: { opacity: fixed(followTwo.out) }, a2: { opacity: fixed(followTwo.in * aThree.out) }, a3: { opacity: fixed(aThree.in) },
    b1: { opacity: fixed(followTwo.out * (1 - dark)) }, b2: { opacity: fixed(followTwo.in * (1 - drop)) }, b3: { opacity: fixed(catchUp) },
    bDark: { opacity: fixed(dark) },
    signalA: drawn(signalA), signalB: drawn(signalB),
  };
}

function Drawing({ a }: { a: Parts }) {
  const number = (prefix:string,x:number,y:number,size:number) => [1,2,3].map(n => <text key={n} data-part={`${prefix}${n}`} x={x} y={y} fontSize={size} textAnchor="middle" className="product-slide-number" {...a[`${prefix}${n}`]}>0{n}</text>);
  return <>
    <path d="M50 325H550" className="product-art-hairline"/>
    <g data-part="peerSurface" {...a.peerSurface}>
      <rect x="4" y="7" width="190" height="126" className="product-art-shadow"/>
      <rect width="190" height="126" rx="3" className="product-art-screen"/>
      <path d="M0 24H190" className="product-art-hairline"/><text x="14" y="17" className="product-art-small">DISPLAY / B</text>
      {number('b',95,105,70)}
      <g data-part="bDark" {...a.bDark}><rect x="1" y="25" width="188" height="100" className="product-art-dark"/><text x="95" y="76" textAnchor="middle" className="product-art-inverse">RECONNECTING</text><path d="M72 95H118" className="product-art-inverse-line"/></g>
    </g>
    <g transform="translate(111 95) rotate(-4 174 108)">
      <rect x="5" y="9" width="348" height="216" className="product-art-shadow"/>
      <rect width="348" height="216" rx="4" className="product-art-screen"/>
      <path d="M0 29H348" className="product-art-hairline"/><text x="17" y="20" className="product-art-small">LIVE / DISPLAY A</text>
      {number('a',174,163,120)}
      <path d="M126 187H222" className="product-art-hairline"/>
    </g>
    <g transform="translate(22 238) rotate(-7 76 48)">
      <rect x="3" y="5" width="152" height="96" className="product-art-shadow"/>
      <rect width="152" height="96" rx="4" className="product-art-screen"/>
      <path d="M0 23H152" className="product-art-hairline"/><text x="10" y="16" className="product-art-small">OPERATOR</text>
      {number('op',76,80,54)}
    </g>
    <path data-part="signalA" d="M176 295H226V280" className="s-strong" pathLength="1" strokeDasharray="1" {...a.signalA}/>
    <path data-part="signalB" d="M470 220H568V90H558" className="s-strong" pathLength="1" strokeDasharray="1" {...a.signalB}/>
  </>;
}

export const avadScene: SceneDefinition = {
  id: 'avad',
  states: ['start', 'fail', 'recover'],
  words: ['TOGETHER', 'DISCONNECTED', 'IN SYNC'],
  thresholds: [0.46, 0.84],
  settled: [0.34, 0.6, 0.94],
  captions: [
    'One operator. Every screen in step.',
    'One screen loses its connection.',
    'It reconnects. The room is back in sync.',
  ],
  alts: [
    'The operator monitor and both shared screens show slide 2.',
    'The operator is on slide 3; one shared screen is dark and its connection is cut.',
    'The connection rejoins and every screen shows slide 3.',
  ],
  parts,
  Drawing,
};
