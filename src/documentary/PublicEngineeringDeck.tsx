import {useEffect,useRef,useState} from 'react';
import {foundation,delivery,platform} from '../rebrand/projectData';
import {useReducedMotion} from '../rebrand/useReducedMotion';
import {ArrowIcon} from '../components/ArrowIcon';

const projects=[foundation,delivery,platform];
const premises=['A reusable infrastructure foundation.','Short-lived access instead of static credentials.','Private compute. A deliberate public entry.'];
const decisions=[foundation.highlights[0],delivery.highlights[1],platform.highlights[0]];
const notes=[
 'Object versioning · remote state. A reusable learning foundation, not a full landing zone.',
 'PR plan is for review; apply uses a fresh plan and an approval gate.',
 'Outbound only through Cloud NAT; public entry is handled by the load balancer.',
];
const rests=[.08,.49,.94];
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(p:number,a:number,b:number)=>{const t=clamp((p-a)/(b-a));return t*t*(3-2*t);};

/** Scroll deals the cards. Only transform/opacity change; long notes stay outside the moving stack. */
export function PublicEngineeringDeck() {
 const track=useRef<HTMLDivElement>(null);
 const seek=useRef<(index:number)=>void>(()=>{});
 const [active,setActive]=useState(0);
 const reduced=useReducedMotion();
 useEffect(()=>{
  const el=track.current;if(!el || reduced)return;
  const stage=el.querySelector<HTMLElement>('.engineering-stack-stage')!;
  const canvas=el.querySelector<HTMLElement>('.engineering-stack-canvas')!;
  const cards=[...el.querySelectorAll<HTMLElement>('[data-engineering-slide]')];
  const life=new AbortController();let frame:number|null=null;let last=-1,selected=-1,navHeight=80,range=1,width=0,pinned=false;
  const render=(p:number)=>{
   p=clamp(p);if(p===last)return;last=p;
   const position=ease(p,.22,.4)+ease(p,.60,.78);
   cards.forEach((card,i)=>{
    const relative=i-position,depart=clamp(-relative),behind=Math.max(0,relative);
    const x=-width*(innerWidth<768?.90:1.12)*ease(depart,0,1);
    const y=behind*18-depart*48;
    const rotation=behind*(i%2?-2.2:2.2)-depart*(innerWidth<768?8:14);
    card.style.transform=`translate(${x}px,${y}px) rotate(${rotation}deg) scale(${1-behind*.045})`;
    card.style.opacity=String(1-ease(depart,.78,1));
   });
   const next=position<.5?0:position<1.5?1:2;
   if(next!==selected){selected=next;setActive(next);cards.forEach((card,i)=>{card.inert=i!==next;card.setAttribute('aria-hidden',String(i!==next));});}
   el.dataset.progress=p.toFixed(3);
  };
  const draw=()=>{frame=null;if(pinned)render((navHeight-el.getBoundingClientRect().top)/range);};
  const queue=()=>{if(pinned && frame===null)frame=requestAnimationFrame(draw);};
  const measure=()=>{
   const previous=selected<0?0:selected;
   const header=document.querySelector('header')?.getBoundingClientRect().height??80;navHeight=header;
   // Desktop typography needs more vertical room than the compact phone cards.
   pinned=innerHeight-header>=(innerWidth>=768?600:500) && CSS.supports('position','sticky');
   el.dataset.mode=pinned?'pin':'manual';
   width=canvas.clientWidth;range=Math.max(1,el.offsetHeight-stage.offsetHeight);last=-1;
   if(pinned)draw();else render(rests[previous]);
  };
  seek.current=index=>{
   index=Math.max(0,Math.min(2,index));
   if(pinned){scrollTo({top:el.getBoundingClientRect().top+scrollY-navHeight+range*rests[index],behavior:'instant'});draw();}
   else render(rests[index]);
  };
  const hash=()=>{const index=projects.findIndex(project=>`#${project.id}`===location.hash);if(index>=0)seek.current(index);};
  const observer=new ResizeObserver(measure);observer.observe(canvas);
  measure();hash();
  void document.fonts?.ready.then(()=>{if(!life.signal.aborted)hash();});
  addEventListener('scroll',queue,{passive:true,signal:life.signal});addEventListener('resize',measure,{signal:life.signal});addEventListener('portfolio-ready',measure,{signal:life.signal});addEventListener('hashchange',hash,{signal:life.signal});
  return()=>{life.abort();observer.disconnect();if(frame!==null)cancelAnimationFrame(frame);el.dataset.mode='static';cards.forEach(card=>{card.inert=false;card.removeAttribute('aria-hidden');card.style.removeProperty('transform');card.style.removeProperty('opacity');});seek.current=()=>{};};
 },[reduced]);
 return <div className="engineering-stack">
  <div ref={track} className="engineering-stack-track" data-mode="static" role="region" aria-label="Public engineering project cards">
   <div className="engineering-stack-stage">
    <div className="engineering-stack-canvas">
     {projects.map((project,i)=><article id={project.id} key={project.id} tabIndex={-1} aria-labelledby={`${project.id}-title`} data-engineering-slide="" style={{zIndex:3-i}}>
      <div className="engineering-card-top"><span>{project.label}</span><span aria-hidden="true">{String(i+1).padStart(2,'0')} / 03</span></div>
      <h3 id={`${project.id}-title`}>{project.title}</h3>
      <p className="stack-premise">{premises[i]}</p>
      <div className="stack-decision"><span>One decision</span><p>{decisions[i]}</p></div>
      <div className="evidence-links">{project.repository&&<a href={project.repository}>Repository <ArrowIcon/></a>}<a href={project.article}>Case study <ArrowIcon/></a><a href={`#${project.id}-notes`} onClick={()=>{const details=document.getElementById(`${project.id}-notes`);if(details instanceof HTMLDetailsElement)details.open=true;}}>Notes <ArrowIcon direction="down"/></a></div>
     </article>)}
    </div>
    <div className="engineering-stack-controls" aria-label="Choose an engineering project">{['Foundation','Delivery','Platform'].map((label,i)=><button key={label} type="button" onClick={()=>seek.current(i)} aria-pressed={active===i}>{String(i+1).padStart(2,'0')} / {label}</button>)}<span role="status" aria-live="polite">{String(active+1).padStart(2,'0')} / 03</span></div>
    <a className="engineering-stack-skip" href="#engineering-notes">Continue to the implementation notes <ArrowIcon direction="down"/></a>
   </div>
  </div>
  <div id="engineering-notes" className="engineering-notes" tabIndex={-1}><p className="eyebrow">Implementation notes</p>{projects.map((project,i)=><details id={`${project.id}-notes`} key={project.id}><summary>{project.title}</summary><p>{project.summary}</p><ul>{project.highlights.map(item=><li key={item}>{item}</li>)}</ul><p>{project.technologies.join(' · ')}</p><p className="evidence-note">{notes[i]}</p><div className="evidence-links">{project.repository&&<a href={project.repository}>View repository <ArrowIcon/></a>}<a href={project.article}>Read case study <ArrowIcon/></a></div></details>)}</div>
 </div>;
}
