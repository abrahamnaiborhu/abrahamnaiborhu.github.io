import { ArrowIcon } from '../../components/ArrowIcon';
import { useScrubScene } from './useScrubScene';
import type { SceneDefinition } from './types';

function SceneArt({ scene, p, label }: { scene: SceneDefinition; p: number; label: string }) {
  const { Drawing } = scene;
  return <svg className="scene-svg" viewBox="0 0 600 360" role="img" aria-label={label}><Drawing a={scene.parts(p)} /></svg>;
}

/** All captions share one grid cell, so the block keeps the height of the longest and nothing around it moves. */
function SceneCaptions({ captions }: { captions: readonly string[] }) {
  return <p className="scene-caption" aria-hidden="true">{captions.map((caption, index) => <span key={caption} data-scrub-caption data-on={index === 0 ? '' : undefined}>{caption}</span>)}</p>;
}

function Dashes() {
  return <span className="scene-dashes" aria-hidden="true"><i data-scrub-dash data-on /><i data-scrub-dash /><i data-scrub-dash /></span>;
}

interface ProductSceneProps {
  scene: SceneDefinition;
  product: string;
  role: string;
  next: { href: string; label: string };
  site: { href: string; name: string };
  account: { product: string; part: string; decision: string; detail: string };
}

/** Closed state of an account panel: what it is, the decision as a teaser, and a toggle. */
export function AccountSummary({ kicker, name, teaser }: { kicker: string; name: string; teaser: string }) {
  return <summary>
    <span className="account-label"><span className="account-kicker">{kicker}</span><span className="account-name">{name}</span></span>
    <span className="account-teaser">{teaser}</span>
    <span className="account-toggle" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M2 8H14" /><path className="account-toggle-vertical" d="M8 2V14" /></svg></span>
  </summary>;
}

function PublicLink({ site }: { site: ProductSceneProps['site'] }) {
  return <p className="scene-public"><a href={site.href}>Visit {site.name} <ArrowIcon /></a><span>Employer-owned product</span></p>;
}

/** A product scene: scroll-scrubbed when motion is allowed, three still frames otherwise. */
export function ProductScene({ scene, product, role, next, site, account }: ProductSceneProps) {
  const track = useScrubScene(scene);
  const accountId = `${scene.id}-account`;
  return <article id={scene.id} className="product-scene" aria-label={product} tabIndex={-1}>
    <div ref={track} className="scene-track" data-mode="static">
      <div className="scene-stage" data-scrub-stage>
        <div className="scene-grid">
          <div className="scene-copy">
            <h3 className="scene-product">{product}</h3>
            <p className="scene-role">{role}</p>
            <SceneCaptions captions={scene.captions} />
            <ol className="sr-only">{scene.captions.map(caption => <li key={caption}>{caption}</li>)}</ol>
            <Dashes />
            <PublicLink site={site} />
            <a className="scene-more" href={`#${accountId}`} onClick={() => { const details = document.getElementById(accountId); if (details instanceof HTMLDetailsElement) details.open = true; }}>How I built it <ArrowIcon direction="down" /></a>
          </div>
          <figure className="scene-art" data-scrub-art><SceneArt scene={scene} p={scene.settled[0]} label={scene.alts[0]} /></figure>
        </div>
        <div className="scene-foot"><span className="scene-progress" aria-hidden="true" /><a href={next.href}>Continue to {next.label} <ArrowIcon direction="down" /></a></div>
      </div>
    </div>
    <div className="scene-still">
      <h3 className="scene-product">{product}</h3>
      <p className="scene-role">{role}</p>
      <PublicLink site={site} />
      <ol className="scene-frames">{scene.settled.map((p, index) => <li key={scene.states[index]}>
        <figure className="scene-art"><SceneArt scene={scene} p={p} label={scene.alts[index]} /></figure>
        <p className="scene-frame-caption">{scene.captions[index]}</p>
      </li>)}</ol>
    </div>
    <details id={accountId} className="scene-account">
      <AccountSummary kicker="How I built it" name={product.split(' · ')[0]} teaser={account.decision} />
      <div className="account-body">
        <div><h4>The product</h4><p>{account.product}</p></div>
        <div><h4>My part</h4><p>{account.part}</p></div>
        <div className="account-decision"><h4>One decision</h4><p className="account-decision-head">{account.decision}</p><p>{account.detail}</p></div>
      </div>
    </details>
  </article>;
}

export { Dashes, SceneCaptions };
