import {useEffect,useRef,useState} from 'react';
import {experience} from '../rebrand/experienceData';
import {useReducedMotion} from '../rebrand/useReducedMotion';
import {ArrowIcon} from '../components/ArrowIcon';

const jobs=[...experience].reverse();
const chapters=['Internal applications','Software in daily use','Business workflows','Applications, cloud & platform'];
const contributions=[
 'Built internal applications and maintained 11 tools supporting security and facility workflows.',
 'Maintained VB.NET applications and introduced React with Electron to modernize front-end workflows.',
 'Turned business requirements into NetSuite customizations and workflow automation.',
 'Built applications and cloud infrastructure, then independently built a shared Kubernetes platform for development and staging.',
];
const clamp=(n:number)=>Math.max(0,Math.min(1,n));

export function CareerReel(){
 const root=useRef<HTMLDivElement>(null);
 const seek=useRef<(i:number)=>void>(()=>{});
 const [active,setActive]=useState(0);
 const reduced=useReducedMotion();
 useEffect(()=>{
  const el=root.current;if(!el||reduced)return;
  const stage=el.querySelector<HTMLElement>('.career-reel-stage')!;
  const panels=[...el.querySelectorAll<HTMLElement>('[data-career-panel]')];
  const rail=el.querySelector<HTMLElement>('.career-reel-rail')!;
  const stops=[...rail.querySelectorAll<HTMLButtonElement>('button')];
  let checkpointY:number[]=[];
  const life=new AbortController();let frame:number|null=null,last=-1,selected=-1,pinned=false,range=1,nav=80;
  const render=(p:number)=>{
   p=clamp(p);if(p===last)return;last=p;
   // Direct linear scroll mapping: no easing, dwell intervals or temporal lag.
   const position=p*3;
   el.style.setProperty('--career-position',String(position));
   el.style.setProperty('--career-arrival',String(clamp(position-2)));
   const segment=Math.min(2,Math.floor(position));
   const end=checkpointY[segment]+(checkpointY[segment+1]-checkpointY[segment])*(position-segment);
   rail.style.setProperty('--career-fill',`${end-checkpointY[0]}px`);
   stops.forEach((stop,i)=>{const reached=String(position>=i-.002);if(stop.dataset.reached!==reached)stop.dataset.reached=reached;});
   panels.forEach((panel,i)=>{
    const distance=i-position;
    panel.style.transform=`translateY(${Math.max(-1,Math.min(1,distance))*56}px)`;
    panel.style.opacity=String(clamp(1-Math.abs(distance)*2));
   });
   const next=Math.round(position);
   if(next!==selected){selected=next;setActive(next);panels.forEach((panel,i)=>{panel.inert=i!==next;panel.setAttribute('aria-hidden',String(i!==next));});}
  };
  const target=()=>clamp((nav-el.getBoundingClientRect().top)/range);
  const draw=()=>{frame=null;if(pinned)render(target());};
  const queue=()=>{if(pinned&&frame===null)frame=requestAnimationFrame(draw);};
  const measure=()=>{
   nav=document.querySelector('header')?.getBoundingClientRect().height??80;
   pinned=innerHeight-nav>=540 && stage.clientWidth>=280;
   el.dataset.mode=pinned?'pin':'manual';
   range=Math.max(1,el.offsetHeight-stage.offsetHeight);last=-1;
   const railTop=rail.getBoundingClientRect().top;
   checkpointY=stops.map(stop=>{const dot=stop.querySelector('.career-rail-dot')!.getBoundingClientRect();return dot.top+dot.height/2-railTop;});
   rail.style.setProperty('--career-line-top',`${checkpointY[0]}px`);
   rail.style.setProperty('--career-line-height',`${checkpointY[3]-checkpointY[0]}px`);
   if(frame!==null){cancelAnimationFrame(frame);frame=null;}
   render(pinned?target():Math.max(0,selected)/3);
  };
  seek.current=i=>{
   const p=i/3;
   if(pinned){scrollTo({top:el.getBoundingClientRect().top+scrollY-nav+range*p,behavior:'instant'});if(frame!==null){cancelAnimationFrame(frame);frame=null;}render(target());}
   else render(p);
  };
  const observer=new ResizeObserver(measure);observer.observe(stage);observer.observe(rail);
  void document.fonts?.ready.then(()=>{if(!life.signal.aborted)measure();});
  measure();addEventListener('scroll',queue,{passive:true,signal:life.signal});
  addEventListener('resize',measure,{signal:life.signal});addEventListener('portfolio-ready',measure,{signal:life.signal});
  return()=>{life.abort();observer.disconnect();if(frame!==null)cancelAnimationFrame(frame);el.dataset.mode='static';rail.style.removeProperty('--career-fill');rail.style.removeProperty('--career-line-top');rail.style.removeProperty('--career-line-height');stops.forEach(stop=>delete stop.dataset.reached);el.style.removeProperty('--career-position');el.style.removeProperty('--career-arrival');panels.forEach(panel=>{panel.inert=false;panel.removeAttribute('aria-hidden');panel.style.removeProperty('transform');panel.style.removeProperty('opacity');});seek.current=()=>{};};
 },[reduced]);
 return <>
  <div ref={root} className="career-reel" data-mode="static" role="region" aria-label="Career journey">
   <div className="career-reel-stage">
    <nav className="career-reel-rail" aria-label="Choose a career chapter">
     {jobs.map((job,i)=><button type="button" key={job.company} onClick={()=>seek.current(i)} aria-pressed={active===i}><span className="career-reel-year">{job.start.slice(0,4)}</span><span>{job.company}</span><span className="career-rail-dot" aria-hidden="true"/></button>)}
    </nav>
    <div className="career-reel-window">
     {jobs.map((job,i)=><article key={job.company} data-career-panel="" aria-labelledby={`career-reel-${i}`}>
      <p className="career-reel-counter">{String(i+1).padStart(2,'0')} / 04 · {job.location}</p>
      <h3 id={`career-reel-${i}`}>{chapters[i]}</h3>
      <p className="career-reel-role">{job.role}</p>
      <p className="career-reel-company">{job.company} · {job.startLabel} — {job.endLabel}</p>
      <p className="career-reel-contribution">{contributions[i]}</p>
      {i===3&&<div className="career-reel-scope"><span>Applications</span><span>Cloud</span><span>Platform</span></div>}
     </article>)}
    </div>
    <a className="career-reel-exit" href="#career-responsibilities">Read the full responsibilities <ArrowIcon direction="down"/></a>
   </div>
  </div>
  <div id="career-responsibilities" tabIndex={-1} className="career-responsibilities"><details><summary>Full career responsibilities</summary>
   <ol className="career-timeline">{jobs.map(job=><li key={job.company}>
    <p className="career-date"><time dateTime={job.start}>{job.startLabel}</time> — {job.end?<time dateTime={job.end}>{job.endLabel}</time>:job.endLabel} · {job.location}</p>
    <h3>{job.role}</h3><p className="career-company">{job.company}</p>
    <ul>{job.highlights.map(item=><li key={item}>{item}</li>)}</ul>
   </li>)}</ol>
  </details></div>
 </>;
}
