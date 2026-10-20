import { drawn, ease, fixed, segment, type Parts, type SceneDefinition } from './types';

const beat = (p:number,a:number,b:number) => ease(segment(p,a,b));

/** Project a real hinged rectangle: its free edge advances toward the viewer; the hinge stays fixed. */
function doorPoint(x:number,y:number,open:number) {
  const angle=open*Math.PI*.42;
  const depth=-x*Math.sin(angle);
  const perspective=700/(700-depth);
  return [fixed(524+x*Math.cos(angle)*perspective),fixed(207+(y-207)*perspective)];
}
function doorPath(open:number,inset=0) {
  const points=[[-150+inset,90+inset],[-inset,90+inset],[-inset,324-inset],[-150+inset,324-inset]];
  return points.map(([x,y],i)=>`${i?'L':'M'}${doorPoint(x,y,open).join(' ')}`).join('')+'Z';
}

// A tap and a pause → verify → controller → open. Reset, cut, hold. Repeat locally, with the cloud still cut.
function parts(p: number): Parts {
  const reset=beat(p,.36,.40);
  const secondTap=beat(p,.60,.67);
  const tap=beat(p,.025,.105)*(1-reset)+secondTap;
  const firstCheck=beat(p,.13,.16)*(1-reset);
  const local=beat(p,.68,.74);
  const check=firstCheck+beat(p,.745,.77);
  const signal=beat(p,.18,.23)*(1-reset)+beat(p,.77,.81);
  const unlock=beat(p,.235,.255)*(1-reset)+beat(p,.81,.825);
  const open=beat(p,.265,.345)*(1-reset)+beat(p,.83,.90);
  const cut=beat(p,.405,.455);
  const pullback=beat(p,.16,.25);
  const zoom=2.05-1.05*pullback;
  const focusX=276+24*pullback,focusY=220-40*pullback;
  const [hx,hy]=doorPoint(-126,202,open);
  const [hx2,hy2]=doorPoint(-126,223,open);
  return {
    camera:{transform:`translate(300 180) scale(${fixed(zoom)}) translate(${-fixed(focusX)} ${-fixed(focusY)})`},
    door:{d:doorPath(open)},doorInset:{d:doorPath(open,15)},
    handle:{d:`M${hx} ${hy}L${hx2} ${hy2}`},
    shadow:{opacity:fixed(open*.18)},
    card:{transform:`translate(${fixed(-82*(1-tap))} ${fixed(32*(1-tap))}) rotate(${fixed(-14*(1-tap))} 256 231)`},
    contact:{opacity:fixed(beat(p,.105,.12)*(1-beat(p,.16,.19))+beat(p,.67,.685)*(1-beat(p,.745,.77)))},
    check:drawn(check),signal:drawn(signal),lock:{transform:`translate(0 ${fixed(-5*unlock)})`},
    cloud:{opacity:fixed((1-.65*cut)*pullback)},
    cloudLeft:{d:`M100 101V136H${fixed(170-18*cut)}`},
    cloudRight:{d:`M${fixed(170+18*cut)} 136H282V174`},
    cloudSignal:{...drawn(beat(p,.12,.17)*(1-reset)),opacity:fixed(1-cut)},
    cut:{opacity:fixed(cut)},offline:{opacity:fixed(cut)},online:{opacity:fixed(1-cut)},
    local:{opacity:fixed(local),transform:`translate(0 ${fixed(12*(1-local))})`},
    localRoute:drawn(beat(p,.70,.745)),
    localSelection:{opacity:fixed(local)},
  };
}

function Drawing({ a }: { a: Parts }) {
  return <g className="sattabi-camera" data-part="camera" {...a.camera}>
    <path className="sattabi-floor" d="M-80 324H700" />
    <rect x="365" y="80" width="169" height="244" className="sattabi-frame"/>
    <rect x="374" y="90" width="150" height="234" className="sattabi-opening"/>
    <path data-part="shadow" d="M374 324H524L476 355H415Z" className="sattabi-shadow" {...a.shadow}/>
    <path data-part="door" className="sattabi-door" {...a.door}/>
    <path data-part="doorInset" className="sattabi-door-inset" {...a.doorInset}/>
    <path data-part="handle" className="sattabi-handle" {...a.handle}/>
    <path className="sattabi-hinge" d="M524 112V133M524 276V297"/>
    <g className="sattabi-controller">
      <rect x="405" y="36" width="89" height="32" rx="3" className="sattabi-device"/>
      <path d="M416 47H431M416 56H437" className="sattabi-detail"/>
      <path data-part="lock" d="M460 54V47A5 5 0 0 1 470 47V54" className="sattabi-detail" {...a.lock}/>
      <rect x="456" y="52" width="18" height="10" rx="1" className="sattabi-ink"/>
      <path d="M450 68V80" className="sattabi-detail"/>
      <text x="450" y="24" textAnchor="middle" className="sattabi-label">Controller</text>
    </g>
    <path d="M282 174V52H405" className="sattabi-wire"/>
    <path data-part="signal" d="M282 174V52H405" className="sattabi-signal" pathLength="1" strokeDasharray="1" {...a.signal}/>
    <g data-part="cloud" {...a.cloud}>
      <path d="M63 101H125A19 19 0 0 0 125 63A28 28 0 0 0 72 56A23 23 0 0 0 63 101Z" className="sattabi-wire"/>
      <path data-part="cloudLeft" className="sattabi-wire" {...a.cloudLeft}/><path data-part="cloudRight" className="sattabi-wire" {...a.cloudRight}/>
      <path data-part="cloudSignal" d="M100 101V136H282V174" className="sattabi-signal" pathLength="1" strokeDasharray="1" {...a.cloudSignal}/>
      <text data-part="online" x="100" y="122" textAnchor="middle" className="sattabi-small" {...a.online}>Cloud</text>
    </g>
    <g data-part="cut" {...a.cut}><path d="M160 126L180 146M180 126L160 146" className="sattabi-cut"/></g>
    <text data-part="offline" x="94" y="172" textAnchor="middle" className="sattabi-offline" {...a.offline}>OFFLINE</text>
    <g className="sattabi-reader">
      <rect x="252" y="174" width="62" height="98" rx="6" className="sattabi-device"/>
      <rect x="260" y="182" width="46" height="36" rx="3" className="sattabi-screen"/>
      <path data-part="check" d="M270 199L279 208L296 191" className="sattabi-signal" pathLength="1" strokeDasharray="1" {...a.check}/>
      <path d="M265 232H299M265 243H292M265 254H299" className="sattabi-detail"/>
      <path data-part="localSelection" d="M265 243H292" className="sattabi-signal" {...a.localSelection}/>
      <text x="283" y="161" textAnchor="middle" className="sattabi-label">Reader</text>
    </g>
    <g data-part="local" {...a.local}>
      <rect x="91" y="283" width="222" height="33" rx="3" className="sattabi-device"/>
      <path d="M104 299L109 304L119 292" className="sattabi-detail"/>
      <text x="131" y="305" className="sattabi-local-label">Allowed locally</text>
    </g>
    <path data-part="localRoute" d="M283 254V283" className="sattabi-signal" pathLength="1" strokeDasharray="1" {...a.localRoute}/>
    <g data-part="card" {...a.card}>
      <rect x="172" y="205" width="80" height="52" rx="4" className="sattabi-card-shadow"/>
      <rect x="169" y="202" width="80" height="52" rx="4" className="sattabi-card"/>
      <rect x="180" y="213" width="13" height="12" rx="2" className="sattabi-chip"/>
      <path d="M180 237H215M180 244H202" className="sattabi-detail"/>
    </g>
    <g data-part="contact" {...a.contact}><path d="M239 191L243 186M235 188V182M244 194H250" className="sattabi-detail"/></g>
  </g>;
}

export const sattabiScene: SceneDefinition = {
  id: 'sattabi',
  states: ['start', 'fail', 'recover'],
  words: ['TAP', 'OFFLINE', 'STILL OPEN'],
  thresholds: [.46,.86],
  settled: [.35,.54,.94],
  captions: [
    'A tap. A check. An open door.',
    'The cloud connection drops.',
    'The connection dropped. Authorized access didn’t.',
  ],
  alts: [
    'A card touches the reader. Access is verified, the controller unlocks, and the hinged door swings open.',
    'The cloud link is visibly severed. The door is closed, ready for another access attempt.',
    'The reader authorizes the card locally. The controller unlocks and the door opens while the cloud remains disconnected.',
  ],
  parts,
  Drawing,
};
