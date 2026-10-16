import { ArrowIcon } from '../../components/ArrowIcon';
import { drawn, ease, fixed, segment, type Parts, type SceneDefinition } from './types';

const fallbackCurve = 'M222 158C335 290 665 290 778 158';
const questions = ['What can keep working?', 'What can we recover?', 'What can we afford?'] as const;

// A request crosses the primary path → the path is cut → a fallback is only
// sketched, never used → the open questions follow. Nothing travels the fallback.
function parts(p: number): Parts {
  const signal = segment(p, 0, 0.15);
  const cut = ease(segment(p, 0.2, 0.32));
  const sketch = segment(p, 0.38, 0.58);
  const shown = (value: boolean) => ({ 'data-shown': String(value) });
  return {
    signal: { ...drawn(signal), opacity: fixed(1 - cut) },
    primaryLeft: { d: `M222 146H${fixed(500 - 50 * cut)}` },
    primaryRight: { d: `M${fixed(500 + 50 * cut)} 146H778` },
    cut: { opacity: fixed(cut), transform: `translate(500 146) scale(${fixed(0.4 + 0.6 * cut)}) translate(-500 -146)` },
    cutLabel: { opacity: fixed(cut) },
    sketch: drawn(sketch),
    sketchLabel: { opacity: fixed(segment(p, 0.5, 0.58)) },
    listCut: shown(p >= 0.26),
    listSketch: shown(p >= 0.48),
    question0: shown(p >= 0.62),
    question1: shown(p >= 0.72),
    question2: shown(p >= 0.82),
  };
}

function Drawing({ a }: { a: Parts }) {
  return <>
    <figure className="fallback-study">
      <svg viewBox="0 0 1000 300" role="img" aria-labelledby="fallback-title fallback-desc">
        <title id="fallback-title">A conceptual fallback path</title>
        <desc id="fallback-desc">A primary path is interrupted. A separate curved fallback path connects the same two endpoints. This is a visual explanation of a design question, not an employer architecture.</desc>
        <defs><mask id="fallback-reveal" maskUnits="userSpaceOnUse"><path data-part="sketch" d={fallbackCurve} fill="none" stroke="#fff" strokeWidth="10" pathLength={1} strokeDasharray="1" {...a.sketch} /></mask></defs>
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="32" y="108" width="190" height="76" /><rect x="778" y="108" width="190" height="76" />
          <path data-part="primaryLeft" {...a.primaryLeft} /><path data-part="primaryRight" {...a.primaryRight} />
          <path data-part="signal" d="M222 146H778" strokeWidth="4" pathLength={1} strokeDasharray="1" {...a.signal} />
          <path d={fallbackCurve} strokeDasharray="8 8" mask="url(#fallback-reveal)" />
          <g data-part="cut" {...a.cut}><path d="M480 126L520 166M520 126L480 166" /></g>
        </g>
        <g fill="currentColor" fontFamily="Helvetica,Arial,sans-serif" textAnchor="middle">
          <text x="127" y="152" fontSize="19">Request</text><text x="873" y="152" fontSize="19">Service</text>
          <text data-part="cutLabel" x="500" y="95" fontSize="16" {...a.cutLabel}>Primary path interrupted</text>
          <text data-part="sketchLabel" x="500" y="282" fontSize="16" {...a.sketchLabel}>A fallback to consider</text>
        </g>
      </svg>
      <div className="mobile-fallback">
        <p>Request</p>
        <div><span>Primary path</span><strong data-part="listCut" className="judgment-reveal" {...a.listCut}>Interrupted ×</strong></div>
        <div data-part="listSketch" className="alternate-path judgment-reveal" {...a.listSketch}><span>Fallback path</span><strong>Another route to consider <ArrowIcon direction="down" /></strong></div>
        <p>Service</p>
      </div>
      <figcaption>Conceptual fallback study</figcaption>
    </figure>
    <p className="judgment-bridge">On the platform, that question is still open: backup and restore validation is ongoing, and a separate backup destination is planned.</p>
    <div className="judgment-lines">{questions.map((question, index) => <p key={question} data-part={`question${index}`} className="judgment-reveal" {...a[`question${index}`]}>{question}</p>)}</div>
  </>;
}

const alt = 'A conceptual fallback path';

export const judgmentScene: SceneDefinition = {
  id: 'judgment',
  states: ['primary', 'cut', 'questions'],
  thresholds: [0.2, 0.62],
  settled: [0.15, 0.58, 1],
  captions: ['', '', ''],
  alts: [alt, alt, alt],
  parts,
  Drawing,
  flowAnchor: 'span',
  pinnable: false,
};
