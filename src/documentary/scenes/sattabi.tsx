import { drawn, ease, fixed, segment, type Parts, type SceneDefinition } from './types';

const beat = (p: number, from: number, to: number) => ease(segment(p, from, to));

/** The door swings into the room; its right hinge remains attached to the frame. */
function doorPoint(x: number, y: number, open: number) {
  const angle = open * Math.PI * .39;
  const depth = -x * Math.sin(angle);
  const perspective = 900 / (900 + depth);
  return [fixed(420 + x * Math.cos(angle) * perspective), fixed(243 + (y - 243) * perspective)];
}

function doorPath(open: number, inset = 0) {
  return [[-212 + inset, 40 + inset], [-inset, 40 + inset], [-inset, 446 - inset], [-212 + inset, 446 - inset]]
    .map(([x, y], i) => `${i ? 'L' : 'M'}${doorPoint(x, y, open).join(' ')}`).join('') + 'Z';
}

// One arrival: tap, an offline hold, local verification, then the physical door opens.
function parts(p: number): Parts {
  const tap = beat(p, .025, .16);
  const cut = beat(p, .25, .34);
  const local = beat(p, .53, .61);
  const unlock = beat(p, .63, .68);
  const open = beat(p, .70, .93);
  const withdraw = beat(p, .65, .76);
  const handleStart = doorPoint(-180, 248, open);
  const handleEnd = doorPoint(-153, 248 + 8 * unlock, open);
  return {
    door: { d: doorPath(open) },
    doorInset: { d: doorPath(open, 14) },
    handle: { d: `M${handleStart.join(' ')}L${handleEnd.join(' ')}` },
    card: { transform: `translate(${fixed(-88 * (1 - tap) - 58 * withdraw)} ${fixed(28 * (1 - tap) + 30 * withdraw)}) rotate(${fixed(-10 * (1 - tap) - 5 * withdraw)} 80 298)` },
    contact: { opacity: fixed(beat(p, .16, .19) * (1 - beat(p, .22, .25))) },
    cut: { opacity: fixed(cut) },
    online: { opacity: fixed(1 - cut) },
    offline: { opacity: fixed(cut) },
    local: { opacity: fixed(local) },
    check: drawn(beat(p, .55, .62)),
    readerLight: { opacity: fixed(local) },
    light: { opacity: fixed(open) },
    shadow: { opacity: fixed(open * .24) },
  };
}

function Drawing({ a }: { a: Parts }) {
  return <g className="sattabi-architecture">
    <path className="sattabi-wall" d="M12 12H468V456H12Z" />
    <path className="sattabi-wall-joint" d="M174 12V456M12 192H174M12 456H468" />
    <path className="sattabi-floor" d="M12 456H468L480 520H0Z" />
    <path data-part="light" className="sattabi-light" d="M208 446H420L470 520H100Z" {...a.light} />
    <path data-part="shadow" className="sattabi-shadow" d="M208 446H420L443 493H236Z" {...a.shadow} />
    <rect x="190" y="24" width="244" height="432" className="sattabi-frame" />
    <rect x="201" y="34" width="222" height="414" className="sattabi-reveal" />
    <rect x="208" y="40" width="212" height="406" className="sattabi-opening" />
    <path data-part="door" className="sattabi-door" {...a.door} />
    <path data-part="doorInset" className="sattabi-door-inset" {...a.doorInset} />
    <path data-part="handle" className="sattabi-handle" {...a.handle} />
    <path className="sattabi-hinge" d="M420 100V121M420 365V386" />
    <path className="sattabi-threshold" d="M201 448H423" />

    <g className="sattabi-connection">
      <text x="28" y="64" className="sattabi-label">CLOUD</text>
      <text data-part="online" x="28" y="98" className="sattabi-status" {...a.online}>ONLINE</text>
      <text data-part="offline" x="28" y="98" className="sattabi-status" {...a.offline}>OFFLINE</text>
      <g data-part="cut" {...a.cut}><path className="sattabi-cut" d="M28 116H145M29 110L39 122M39 110L29 122" /></g>
    </g>

    <g className="sattabi-reader">
      <rect x="100" y="242" width="53" height="85" rx="3" className="sattabi-device-shadow" />
      <rect x="96" y="238" width="53" height="85" rx="3" className="sattabi-device" />
      <rect x="104" y="248" width="37" height="36" rx="1" className="sattabi-screen" />
      <path data-part="check" d="M111 265L119 273L134 256" className="sattabi-signal" pathLength="1" strokeDasharray="1" {...a.check} />
      <path className="sattabi-reader-slot" d="M107 302H138" />
      <path data-part="readerLight" className="sattabi-reader-light" d="M107 302H138" {...a.readerLight} />
    </g>

    <g data-part="card" {...a.card}>
      <rect x="31" y="281" width="65" height="42" rx="2" className="sattabi-card-shadow" />
      <rect x="28" y="278" width="65" height="42" rx="2" className="sattabi-card" />
      <rect x="37" y="286" width="12" height="10" rx="1" className="sattabi-chip" />
      <path d="M37 307H73M37 312H60" className="sattabi-card-detail" />
    </g>
    <g data-part="contact" {...a.contact}><path d="M84 263L90 257M96 266H103" className="sattabi-contact" /></g>
    <g data-part="local" {...a.local}>
      <text x="28" y="383" className="sattabi-local-label">LOCAL</text>
      <text x="28" y="416" className="sattabi-local-label">ACCESS</text>
      <path d="M29 434H145" className="sattabi-local-rule" />
    </g>
  </g>;
}

export const sattabiScene: SceneDefinition = {
  id: 'sattabi',
  viewBox: '0 0 480 520',
  states: ['start', 'fail', 'recover'],
  words: ['ARRIVE', 'OFFLINE', 'STILL OPEN'],
  thresholds: [.34, .70],
  settled: [.2, .46, .96],
  captions: [
    'A card. A door. An ordinary arrival.',
    'The cloud is offline. The door has a local answer.',
    'Authorized locally. The door still opens.',
  ],
  alts: [
    'A card arrives at the wall-mounted reader beside a closed architectural doorway.',
    'The cloud is offline. The card remains at the reader and the door is still closed.',
    'The reader confirms local authorization. The same door opens inward into light while the cloud remains offline.',
  ],
  parts,
  Drawing,
};
