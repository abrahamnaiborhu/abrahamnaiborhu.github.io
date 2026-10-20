export type PortfolioReadiness = 'ready' | 'timeout' | 'aborted';

/** Local page assets only: downloads/resume links and external sites are not startup dependencies. */
export function waitForPortfolio(signal: AbortSignal, timeoutMs = 8000): Promise<PortfolioReadiness> {
  return new Promise(resolve => {
    const listeners = new AbortController();
    let frame = 0;
    let settled = false;
    const finish = (result: PortfolioReadiness) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      listeners.abort();
      resolve(result);
    };
    const timeout = setTimeout(() => finish('timeout'), timeoutMs);
    if (signal.aborted) { finish('aborted'); return; }
    signal.addEventListener('abort', () => finish('aborted'), { once:true, signal:listeners.signal });
    const images = [...document.images].map(async image => {
      // The current portfolio has one eager portrait. Don't turn future lazy media into a deadlock.
      if (image.loading === 'lazy') return;
      if (!image.complete) await new Promise<void>(done => {
        image.addEventListener('load', () => done(), { once:true, signal:listeners.signal });
        image.addEventListener('error', () => done(), { once:true, signal:listeners.signal });
      });
      if (image.naturalWidth && typeof image.decode === 'function') await image.decode().catch(() => {});
    });
    void Promise.all([document.fonts?.ready, ...images]).then(() => {
      if (settled) return;
      // Allow mounted scene effects and final asset dimensions to reach layout before handoff.
      frame = requestAnimationFrame(() => {
        document.querySelectorAll('.scene-track, .platform-film, .unfold .film').forEach(el => el.getBoundingClientRect());
        window.dispatchEvent(new Event('portfolio-ready'));
        frame = requestAnimationFrame(() => finish('ready'));
      });
    }).catch(() => finish('ready'));
  });
}
