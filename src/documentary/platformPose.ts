const clamp = (n: number) => Math.max(0, Math.min(1,n));
const ease = (p: number, a: number, b: number) => { const t = clamp((p-a)/(b-a)); return t*t*(3-2*t); };
const mix = (a: number,b: number,p: number) => a+(b-a)*p;

/** Bind once per mount; the persistent release node is never replaced at stage boundaries. */
export function bindPlatformPose(root: HTMLElement) {
  const nodes = new Map([...root.querySelectorAll<HTMLElement | SVGElement>('[data-payoff]')].map(el => [el.dataset.payoff!,el]));
  const peers = [...root.querySelectorAll<SVGElement>('[data-payoff-peer]')];
  const words = [...root.querySelectorAll<HTMLElement>('[data-payoff-word]')];
  const set = (name:string, values: Record<string,string|number>) => {
    const el = nodes.get(name);
    if (el) for (const [key,value] of Object.entries(values)) el.setAttribute(key,String(value));
  };
  return (progress:number) => {
    const p = clamp(progress);
    const build = ease(p,.13,.29);
    const config = ease(p,.34,.46);
    const run = ease(p,.53,.67);
    const team = ease(p,.76,.92);
    const scale = mix(mix(1,.62,config),1,run) * mix(1,.305,team);
    const x = mix(0,config*105,1-run) + mix(0,-256,team);
    const y = mix(0,config*18,1-run) + mix(0,-98,team);
    set('release',{transform:`translate(${400+x} ${210+y}) scale(${scale}) rotate(${-5*Math.sin(build*Math.PI)*(1-config)}) translate(-400 -210)`});
    set('code',{opacity:1-build});set('image',{opacity:build*(1-run)});set('app',{opacity:run});
    const fold = Math.sin(build*Math.PI)*(1-config);
    set('left-fold',{opacity:fold,transform:`translate(210 0) scale(${mix(.05,1,fold)} 1) translate(-210 0)`});
    set('right-fold',{opacity:fold,transform:`translate(590 0) scale(${mix(.05,1,fold)} 1) translate(-590 0)`});
    set('config',{opacity:config*(1-run),transform:`translate(0 ${mix(70,0,config)})`});
    set('version',{opacity:build*(1-ease(p,.66,.74)),transform:`translate(${mix(286,335,config)} ${mix(315,165,config)})`});
    set('runtime',{opacity:run*(1-team)});set('trace',{'stroke-dashoffset':1-ease(p,.62,.75)});
    set('foundation',{opacity:team});set('scope',{opacity:team});
    const scope = nodes.get('scope-copy');if(scope) scope.style.opacity=String(team);
    peers.forEach((peer,i) => {
      const slot=i+1;const tx=144+(slot%5)*128,ty=112+Math.floor(slot/5)*156;
      const arrival=ease(p,.76+i*.008,.87+i*.006);
      peer.setAttribute('opacity',String(arrival));
      peer.setAttribute('transform',`translate(${mix(400,tx,arrival)} ${mix(210,ty,arrival)}) scale(${mix(.15,1,arrival)})`);
    });
    const index=Math.min(4,Math.floor(p*5));
    words.forEach((word,i) => {word.style.opacity=i===index?'1':'0';word.style.transform=`translateX(${i===index?0:-24}px)`;});
  };
}
