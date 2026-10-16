import { ease, fixed, segment, type Parts, type SceneDefinition } from './types';

export const startingRows = [
  ['Manual', 'A push triggers checks, a build and a versioned deploy'],
  ['Easy to break', 'Every change is checked and built the same way; the recorded version keeps running'],
  ['Invisible', 'Metrics, logs and alerts'],
  ['Couldn’t grow', 'The main internal app’s workers scale to more copies'],
  ['No fallback', 'Backup and restore validation; a separate backup destination is planned'],
] as const;

// Each problem is cut until the platform answers it; the fallback stays open.
function parts(p: number): Parts {
  const result: Parts = {};
  startingRows.forEach((_, index) => {
    const open = index === 4;
    const solved = open ? 0 : ease(segment(p, 0.26 + index * 0.1, 0.32 + index * 0.1));
    const pending = open ? ease(segment(p, 0.68, 0.74)) : 0;
    const gap = 14 * (1 - solved);
    result[`row${index}Left`] = { d: `M4 12H${fixed(60 - gap)}`, opacity: fixed(1 - pending) };
    result[`row${index}Right`] = { d: `M${fixed(60 + gap)} 12H116`, opacity: fixed(1 - pending) };
    result[`row${index}Cut`] = { opacity: fixed((1 - solved) * (1 - pending)) };
    if (open) result.row4Pending = { opacity: fixed(pending) };
    result[`row${index}Answer`] = { 'data-shown': String((open ? pending : solved) > 0.5) };
  });
  return result;
}

function Drawing({ a }: { a: Parts }) {
  return <ol className="starting-rows">
    {startingRows.map(([problem, answer], index) => <li key={problem}>
      <span className="starting-problem">{problem}</span>
      <svg viewBox="0 0 120 24" aria-hidden="true">
        <path data-part={`row${index}Left`} className="s-line" {...a[`row${index}Left`]} />
        <path data-part={`row${index}Right`} className="s-line" {...a[`row${index}Right`]} />
        <path data-part={`row${index}Cut`} className="s-break" d="M53 5L67 19M67 5L53 19" {...a[`row${index}Cut`]} />
        {index === 4 && <path data-part="row4Pending" className="starting-pending-line" d="M4 12H116" {...a.row4Pending} />}
      </svg>
      <span data-part={`row${index}Answer`} className="starting-answer" {...a[`row${index}Answer`]}>{index === 4 && <b>In progress</b>}{answer}</span>
    </li>)}
  </ol>;
}

export const startingScene: SceneDefinition = {
  id: 'starting-point',
  states: ['start', 'change', 'settled'],
  thresholds: [0.3, 0.66],
  settled: [0.15, 0.52, 0.9],
  captions: [
    'Every deploy was by hand. When something broke, it simply broke.',
    'I replaced the routine with a platform, one problem at a time.',
    'One problem is still open, and I’m working on it.',
  ],
  alts: ['', '', ''],
  parts,
  Drawing,
  flowAnchor: 'span',
};
