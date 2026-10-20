export function mountUnfold(root: HTMLElement) {
const header = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
const film = root.querySelector<HTMLElement>('.film')!;
const stage = root.querySelector<HTMLElement>('.stage')!;
const world = root.querySelector<HTMLElement>('.world')!;
const app = root.querySelector<HTMLElement>('.application')!;
const deploy = root.querySelector<HTMLElement>('.deploy')!;
const runtime = root.querySelector<HTMLElement>('.runtime')!;
const monitor = root.querySelector<HTMLElement>('.monitor')!;
const ground = root.querySelector<HTMLElement>('.ground')!;
const spine = root.querySelector<HTMLElement>('.spine')!;
const peers = [...root.querySelectorAll<HTMLElement>('.peer')];
const range = root.querySelector<HTMLInputElement>('input[type=range]')!;
const play = root.querySelector<HTMLButtonElement>('.play')!;
const output = root.querySelector<HTMLOutputElement>('.progress')!;
const phases = [...root.querySelectorAll<HTMLElement>('[data-seek]')];
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const life = new AbortController();
let frame: number | null = null;
let progress = 0;
let playing = false;
let playStart = 0;
let playFrom = 0;
let lastPhase = '';
let lastWidth = -1;
let lastHeight = -1;
const copyGroups = ['application','operations','shared'].map(name => [...root.querySelectorAll<HTMLElement>(`[data-copy=${name}]`)]);
const chapter = root.querySelector<HTMLElement>('.chapter')!;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const part = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const smooth = (x: number) => x * x * (3 - 2 * x);
const beat = (p: number, a: number, b: number) => smooth(part(p, a, b));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

// Resolve each sheet into the same camera explicitly. Nested preserve-3d
// contexts flattened the rear sheets in the observed WebKit rendering.
const geometry = new Map([app,deploy,runtime,monitor,ground,spine,...peers].map(element => [element, {
  x:element.offsetLeft, y:element.offsetTop, width:element.offsetWidth, height:element.offsetHeight,
}]));
const radians = (degrees: number) => degrees * Math.PI / 180;

function project(element: HTMLElement, camera: {roll:number; pitch:number; scale:number; y:number}, depth: number, angle = 0, axis = 'y', hinge = 'center', size = 1) {
  const { x,y,width,height } = geometry.get(element)!;
  const ox = hinge === 'left' ? 0 : hinge === 'right' ? width : width / 2;
  const oy = hinge === 'top' ? 0 : height / 2;
  const a = radians(angle);
  const points = [[0,0],[width,0],[width,height],[0,height]].map(([u,v]) => {
    let px = (u - ox) * size;
    let py = (v - oy) * size;
    let pz = depth;
    if (axis === 'y') { pz -= px * Math.sin(a); px *= Math.cos(a); }
    else { pz += py * Math.sin(a); py *= Math.cos(a); }
    px += x + ox - 360;
    py += y + oy - 260;
    const rx = px * Math.cos(camera.roll) - py * Math.sin(camera.roll);
    const ry = px * Math.sin(camera.roll) + py * Math.cos(camera.roll);
    const cy = ry * Math.cos(camera.pitch) - pz * Math.sin(camera.pitch);
    const cz = ry * Math.sin(camera.pitch) + pz * Math.cos(camera.pitch);
    const perspective = 1200 / (1200 - cz);
    return { x:360 + rx * camera.scale * perspective - x, y:260 + (cy * camera.scale + camera.y) * perspective - y };
  });
  // Map the rectangular sheet to its four projected corners. The browser
  // receives a planar homography, not a nested camera/depth hierarchy.
  const [p0,p1,p2,p3] = points;
  const sx = p0.x - p1.x + p2.x - p3.x;
  const sy = p0.y - p1.y + p2.y - p3.y;
  const dx1 = p1.x - p2.x, dx2 = p3.x - p2.x;
  const dy1 = p1.y - p2.y, dy2 = p3.y - p2.y;
  const determinant = dx1 * dy2 - dx2 * dy1;
  const g = Math.abs(determinant) < 1e-8 ? 0 : (sx * dy2 - dx2 * sy) / determinant;
  const h = Math.abs(determinant) < 1e-8 ? 0 : (dx1 * sy - sx * dy1) / determinant;
  const matrix = [
    (p1.x - p0.x + g * p1.x)/width,(p1.y - p0.y + g * p1.y)/width,0,g/width,
    (p3.x - p0.x + h * p3.x)/height,(p3.y - p0.y + h * p3.y)/height,0,h/height,
    0,0,1,0,p0.x,p0.y,0,1,
  ];
  element.style.transform = `matrix3d(${matrix.join(',')})`;
}

function render(p: number) {
  p = clamp(p);
  if(p===progress && lastWidth===innerWidth && lastHeight===innerHeight) return;
  lastWidth=innerWidth;lastHeight=innerHeight;
  progress = p;
  // Settle the physical scene before the sticky stage releases to the next chapter.
  p = Math.min(1, p / .9);
  const phone = innerWidth <= 760;
  const open = beat(p, .16, .64);
  const shared = beat(p, .69, .97);
  const scale = Math.min(innerWidth * (phone ? (stage.clientHeight < 600 ? .60 : .72) : .38), phone ? 380 : 580) / 300;
  const middleScale = phone ? (stage.clientHeight < 700 ? .48 : .62) : Math.min(.67, (stage.clientHeight - 190) / (650 * scale));
  const cameraScale = mix(mix(1, middleScale, open), .31, shared);
  const pitch = mix(phone ? 47 : 56, phone ? 43 : 53, shared) * open;
  const roll = mix(mix(-7, phone ? -17 : -28, open), phone ? -8 : -20, shared);
  const camera = {scale:scale * cameraScale,pitch:radians(pitch),roll:radians(roll),y:mix(0,-12,open)};
  world.style.transform = 'none';
  project(app,camera,180 + Math.sin(open * Math.PI) * 30,-12 * open * (1 - shared));
  const leaves: [HTMLElement,number,number,number,number][] = [[deploy,.17,.41,-1,60],[runtime,.30,.54,1,-60],[monitor,.43,.66,-1,-180]];
  for (const [element, from, to, direction, depth] of leaves) {
    const unfolded = beat(p, from, to);
    const angle = direction * 100 * (1 - unfolded);
    element.style.opacity = String(beat(p, from, from + .05));
    project(element,camera,depth,angle,element === monitor ? 'x' : 'y',element === deploy ? 'left' : element === runtime ? 'right' : 'top')!;
  }
  ground.style.opacity = String(beat(p, .68, .76));
  project(ground,camera,-215,0,'y','center',mix(.3,1,shared));
  spine.style.opacity = String(open);
  project(spine,camera,180,-90,'x','top')!;
  peers.forEach((peer,i) => {
    const arrival = beat(p, .73 + i * .035, .93 + i * .035);
    peer.style.opacity = String(beat(p, .73 + i * .035, .78 + i * .035));
    project(peer,camera,180,(i === 0 ? -85 : 85) * (1 - arrival),'y',i === 0 ? 'left' : 'right')!;
  });
  stage.style.setProperty('--behind', String(open));
  stage.style.setProperty('--word-x', `${-innerWidth * .13 * open}px`);
  const phase = p < .29 ? 'application' : p < .75 ? 'operations' : 'shared';
  const visibility = [1 - beat(p,.23,.30), beat(p,.28,.35) * (1 - beat(p,.71,.77)), beat(p,.75,.82)];
  copyGroups.forEach((elements,i) => {
    for (const element of elements) {
      element.style.opacity = String(visibility[i]);
      element.style.transform = `translateY(${(1 - visibility[i]) * 24}px)`;
    }
  });
  if (phase !== lastPhase) {
    lastPhase = phase;
    stage.dataset.phase = phase;
    chapter.textContent = phase === 'application' ? '01' : phase === 'operations' ? '02' : '03';
    phases.forEach((button,i) => button.setAttribute('aria-pressed', String(['application','operations','shared'][i] === phase)));
  }
  range.value = String(Math.round(progress * 1000));
  output.value = String(Math.round(progress * 1000)).padStart(3, '0')!;
  stage.dataset.progress = progress.toFixed(3);
}

function scrollRange() { return Math.max(1, film.offsetHeight - stage.offsetHeight); }
function stop() { playing = false; play.textContent = motion.matches ? 'Motion reduced' : 'Play sequence'; }
function seek(p: number) {
  if (motion.matches) { render(p); return; }
  scrollTo({ top:(film.getBoundingClientRect().top + scrollY - header()) + p * scrollRange(), behavior:'instant' });
  render(p);
}
function tick(time: number) {
  frame = null;
  if (playing) {
    const p = clamp(playFrom + (time - playStart) / 11000);
    seek(p);
    if (p >= 1) stop();
  } else if (!motion.matches) render((scrollY - (film.getBoundingClientRect().top + scrollY - header())) / scrollRange());
  if (playing) frame = requestAnimationFrame(tick);
}
function queue() { if (frame === null) frame = requestAnimationFrame(tick); }
function preference() {
  stop();
  play.disabled = motion.matches;
  play.textContent = motion.matches ? 'Motion reduced' : 'Play sequence';
  render(motion.matches ? 1 : (scrollY - (film.getBoundingClientRect().top + scrollY - header())) / scrollRange());
}

root.classList.add('motion-ready');
root.querySelector<HTMLElement>('.controls')!.hidden = false;
root.querySelector<HTMLElement>('.phase-controls')!.hidden = false;
range.addEventListener('input', () => { stop(); seek(Number(range.value) / 1000); }, { signal:life.signal });
phases.forEach(button => button.addEventListener('click', () => { stop(); seek(Number(button.dataset.seek)); }, { signal:life.signal }));
play.addEventListener('click', () => {
  if (playing) { stop(); return; }
  if (progress > .99) seek(0);
  playing = true;
  playFrom = progress;
  playStart = performance.now();
  play.textContent = 'Pause sequence';
  queue();
}, { signal:life.signal });
addEventListener('scroll', queue, { passive:true, signal:life.signal });
addEventListener('resize', queue, { signal:life.signal });
addEventListener('pageshow', queue, { signal:life.signal });
addEventListener('wheel', stop, { passive:true, signal:life.signal });
addEventListener('touchstart', stop, { passive:true, signal:life.signal });
addEventListener('keydown', stop, { signal:life.signal });
addEventListener('hashchange', stop, { signal:life.signal });
root.querySelector('.unfold-skip')!.addEventListener('click', stop, { signal:life.signal });
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); }, { signal:life.signal });
motion.addEventListener('change', preference, { signal:life.signal });
addEventListener('pagehide', () => {
  stop();
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null;
  
}, { signal:life.signal });
preference();

return () => {life.abort(); if (frame !== null) cancelAnimationFrame(frame); root.classList.remove('motion-ready');};
}
