import {ArrowIcon} from '../components/ArrowIcon';
import {judgmentScene as scene} from './scenes/judgment';
import {useScrubScene} from './scenes/useScrubScene';
import {SceneCaptions,Dashes} from './scenes/ScrubScene';

export function JudgmentFilm() {
 const track=useScrubScene(scene);const {Drawing}=scene;
 return <section id="judgment" tabIndex={-1} className="scene failure-scene judgment-chapter" aria-labelledby="failure-title">
  <div className="scene-top"><span>Engineering judgment</span><span>Reliability within constraints</span></div>
  <div className="failure-heading"><div className="narration"><h2 id="failure-title">I keep asking:<br/><em>what if this fails?</em></h2></div><p>High availability has a cost. I look for practical ways to keep essential behavior working, and separate a working fallback from recovery that still needs proof.</p></div>
  <div className="product-scene judgment-film">
   <div ref={track} className="scene-track judgment-track" data-mode="static" data-product-film="">
    <div className="scene-stage" data-scrub-stage>
     <div className="product-film-word" aria-hidden="true">{scene.words!.map((word,i)=><span key={word} data-film-word data-on={i===0?'':undefined}>{word}</span>)}</div>
     <div className="product-film-heading"><h3 className="scene-product">When the normal path fails</h3><p className="scene-role">Conceptual example · Sattabi local access</p></div>
     <div className="scene-grid"><div className="scene-copy"><SceneCaptions captions={scene.captions}/><Dashes/></div><figure className="scene-art" data-scrub-art><svg className="scene-svg" viewBox="0 0 600 360" role="img" aria-label={scene.alts[0]}><Drawing a={scene.parts(scene.settled[0])}/></svg></figure></div>
     <div className="product-film-controls" aria-label="Choose a reliability moment">{['Normal path','Interruption','Fallback'].map((word,i)=><button key={word} type="button" data-scene-seek={scene.settled[i]} aria-pressed={i===0}>{String(i+1).padStart(2,'0')} / {word}</button>)}</div>
     <div className="scene-foot"><span className="scene-progress" aria-hidden="true"/><a href="#judgment-decisions">Continue to the tradeoffs <ArrowIcon direction="down"/></a></div>
    </div>
   </div>
   <div className="scene-still"><ol className="scene-frames">{scene.settled.map((p,i)=><li key={p}><svg className="scene-svg" viewBox="0 0 600 360" role="img" aria-label={scene.alts[i]}><Drawing a={scene.parts(p)}/></svg><p className="scene-frame-caption">{scene.captions[i]}</p></li>)}</ol></div>
  </div>
  <div id="judgment-decisions" tabIndex={-1} className="judgment-decisions">
   <p className="judgment-premise">A fallback is only useful when we know its limits.</p>
   <div className="judgment-decision-grid">
    <article><span>01 / Keep working</span><h3>Preserve the essential action.</h3><p>Sattabi keeps a local copy of who may enter, so authorized access can continue when the cloud connection drops.</p></article>
    <article><span>02 / Know the limits</span><h3>Name the remaining dependencies.</h3><p>My current development and staging platform has a single database writer and shared storage dependencies. Those remain constraints in its recovery design.</p></article>
    <article><span>03 / Prove recovery</span><h3>Validate before claiming resilience.</h3><p>On the platform, that question is still open: backup and restore validation is ongoing, and a separate backup destination is planned.</p></article>
   </div>
   <a className="judgment-next" href="#contact">Continue to the next team <ArrowIcon direction="down"/></a>
  </div>
 </section>;
}
