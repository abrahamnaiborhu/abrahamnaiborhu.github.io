import { drawn, ease, fixed, segment, type Parts, type SceneDefinition } from './types';

// Card taps, cloud confirms, door opens → reset, cloud link cut → card taps,
// the reader's local copy answers and the door opens with the link still cut.
function parts(p: number): Parts {
  const first = p < 0.36, between = p < 0.58;
  const card = first ? ease(segment(p, 0.04, 0.14)) : between ? 1 - ease(segment(p, 0.36, 0.44)) : ease(segment(p, 0.58, 0.66));
  const cloud = first ? segment(p, 0.14, 0.2) : 1 - segment(p, 0.36, 0.4);
  const check = first ? segment(p, 0.2, 0.24) : between ? 1 - segment(p, 0.36, 0.4) : segment(p, 0.72, 0.76);
  const signal = first ? segment(p, 0.24, 0.28) : between ? 1 - segment(p, 0.36, 0.4) : segment(p, 0.76, 0.8);
  const door = first ? ease(segment(p, 0.28, 0.34)) : between ? 1 - ease(segment(p, 0.36, 0.44)) : ease(segment(p, 0.8, 0.88));
  const gap = ease(segment(p, 0.44, 0.54));
  const local = ease(segment(p, 0.66, 0.72));
  const half = 17 * gap;
  return {
    door: { transform: `translate(522 217) skewY(${fixed(-8 * door)}) scale(${fixed(1 - 0.78 * door)} 1) translate(-522 -217)` },
    handle: { opacity: fixed(1 - door) },
    lock: { opacity: fixed(signal) },
    lockLine: drawn(door > 0 ? signal : 0),
    signal: drawn(signal),
    check: drawn(check),
    listQuiet: { opacity: fixed(1 - local) },
    listLocal: { opacity: fixed(local) },
    cloudLeft: { d: `M108 104V130H${fixed(191 - half)}` },
    cloudRight: { d: `M${fixed(191 + half)} 130H310V176` },
    cloudSignal: drawn(cloud),
    cut: { opacity: fixed(gap), transform: `translate(191 130) scale(${fixed(0.4 + 0.6 * gap)}) translate(-191 -130)` },
    card: { transform: `translate(${fixed(-100 * (1 - card))} ${fixed(30 * (1 - card))})` },
  };
}

function Drawing({ a }: { a: Parts }) {
  return <>
    <path className="s-soft" d="M40 316H560" />
    <path className="s-line" d="M380 316V110H530V316" />
    <g data-part="door" {...a.door}><rect className="s-panel" x="388" y="118" width="134" height="198" /><path data-part="handle" className="s-line" d="M402 208V228" {...a.handle} /></g>
    <rect className="s-panel" x="420" y="56" width="72" height="30" rx="3" /><path className="s-line" d="M428 65H440M428 73H440" />
    <rect data-part="lock" className="s-solid" x="452" y="64" width="12" height="14" rx="1" {...a.lock} />
    <path className="s-line" d="M458 86V110" /><path data-part="lockLine" className="s-strong" d="M458 86V110" pathLength={1} strokeDasharray="1" {...a.lockLine} />
    <path className="s-soft" d="M321 176V71H420" /><path data-part="signal" className="s-strong" d="M321 176V71H420" pathLength={1} strokeDasharray="1" {...a.signal} />
    <rect className="s-panel" x="296" y="176" width="50" height="80" rx="4" /><rect className="s-line" x="303" y="184" width="36" height="30" rx="2" />
    <path data-part="check" className="s-strong" d="M312 199L318 205L330 192" pathLength={1} strokeDasharray="1" {...a.check} />
    <path data-part="listQuiet" className="s-soft" d="M306 226H336M306 234H330M306 242H336" {...a.listQuiet} />
    <g data-part="listLocal" {...a.listLocal}><path className="s-line" d="M306 226H336M306 242H336" /><path className="s-strong" d="M306 234H330" /><path className="s-line" d="M290 282L306 246" /><text className="s-label" x="286" y="300" textAnchor="end">Local copy</text></g>
    <path className="s-line" d="M70 104H146a22 22 0 0 0 0-44a32 32 0 0 0-60-8a24 24 0 0 0-16 52Z" />
    <text className="s-label" x="176" y="88">Cloud</text>
    <path data-part="cloudLeft" className="s-line" {...a.cloudLeft} /><path data-part="cloudRight" className="s-line" {...a.cloudRight} />
    <path data-part="cloudSignal" className="s-strong" d="M108 104V130H310V176" pathLength={1} strokeDasharray="1" {...a.cloudSignal} />
    <g data-part="cut" {...a.cut}><path className="s-break" d="M181 120L201 140M201 120L181 140" /></g>
    <g data-part="card" {...a.card}><rect className="s-panel" x="222" y="196" width="66" height="44" rx="4" /><path className="s-line" d="M234 210H258M234 220H274M234 230H248" /></g>
    <text className="s-label" x="290" y="170" textAnchor="end">Reader</text>
    <text className="s-label" x="456" y="42" textAnchor="middle">Controller</text>
  </>;
}

export const sattabiScene: SceneDefinition = {
  id: 'sattabi',
  states: ['start', 'fail', 'recover'],
  thresholds: [0.4, 0.66],
  settled: [0.34, 0.54, 0.88],
  captions: [
    'A card, a QR pass or a button in the app opens the door.',
    'Then the internet connection drops.',
    'The door still opens. Each door keeps its own copy of who may enter.',
  ],
  alts: [
    'A card taps the reader; the cloud confirms; the door opens.',
    'The line to the cloud is cut; the door is closed.',
    'With the cloud still cut, the reader checks its local copy and the door opens.',
  ],
  parts,
  Drawing,
};
