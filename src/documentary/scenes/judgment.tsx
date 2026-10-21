import {drawn,ease,fixed,segment,type Parts,type SceneDefinition} from './types';
const beat=(p:number,a:number,b:number)=>ease(segment(p,a,b));

function parts(p:number):Parts {
 const approach=beat(p,.025,.19),cut=beat(p,.21,.29),route=beat(p,.46,.60),travel=beat(p,.64,.88);
 // The fallback is a quadratic arc from the interrupted request to the service.
 const x=260+(520-260)*travel;
 const y=(1-travel)*(1-travel)*180+2*(1-travel)*travel*352+travel*travel*180;
 return {
  request:{opacity:fixed(1-beat(p,.89,.93)),transform:`translate(${fixed(travel>0?x:80+180*approach)} ${fixed(travel>0?y:180)})`},
  primaryLeft:{d:`M80 180H${fixed(310-28*cut)}`},primaryRight:{d:`M${fixed(310+28*cut)} 180H520`},
  cut:{opacity:fixed(cut)},fallback:{...drawn(route),opacity:fixed(route)},
  fallbackLabel:{opacity:fixed(route)},arrival:{opacity:fixed(beat(p,.88,.93))},
  stopped:{opacity:fixed(cut*(1-beat(p,.61,.65)))},
 };
}
function Drawing({a}:{a:Parts}) {
 return <>
  <path data-part="primaryLeft" className="judgment-route-muted" {...a.primaryLeft}/><path data-part="primaryRight" className="judgment-route-muted" {...a.primaryRight}/>
  <path data-part="fallback" d="M260 180Q390 352 520 180" className="judgment-route-live" pathLength="1" strokeDasharray="1" {...a.fallback}/>
  <g data-part="cut" {...a.cut}><path d="M296 166L324 194M324 166L296 194" className="judgment-route-cut"/><text x="310" y="142" textAnchor="middle" className="judgment-art-label">PRIMARY PATH LOST</text></g>
  <circle cx="80" cy="180" r="31" className="judgment-endpoint"/><path d="M68 180H92M80 168V192" className="judgment-route-muted"/>
  <rect x="488" y="148" width="64" height="64" rx="4" className="judgment-endpoint"/>
  <path data-part="arrival" d="M503 180L515 191L537 168" className="judgment-route-live" {...a.arrival}/>
  <g data-part="request" {...a.request}><rect x="-17" y="-12" width="34" height="24" rx="3" className="judgment-request"/><path d="M-10-5L0 3L10-5" className="judgment-request-fold"/></g>
  <text x="80" y="240" textAnchor="middle" className="judgment-art-label">REQUEST</text><text x="520" y="240" textAnchor="middle" className="judgment-art-label">ACCESS</text>
  <text data-part="stopped" x="228" y="217" textAnchor="middle" className="judgment-art-small" {...a.stopped}>WAITING</text>
  <g data-part="fallbackLabel" {...a.fallbackLabel}><text x="390" y="302" textAnchor="middle" className="judgment-art-label">LOCAL AUTHORIZATION</text><text x="390" y="327" textAnchor="middle" className="judgment-art-small">SATTABI / IMPLEMENTED FALLBACK</text></g>
 </>;
}
export const judgmentScene:SceneDefinition={
 id:'judgment',states:['primary','cut','continue'],words:['WHAT IF?','INTERRUPTED','CONTINUE'],thresholds:[.29,.88],settled:[.19,.42,.96],
 captions:['First, understand the failure.','The primary path stops. Hold that thought.','A local fallback keeps access moving.'],
 alts:['A request approaches its destination along the primary path.','The primary path breaks and the request waits before the break.','The request travels through local authorization and access continues. Conceptual illustration of Sattabi’s implemented fallback, not the platform architecture.'],
 parts,Drawing,
};
