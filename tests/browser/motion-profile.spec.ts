import { writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test('record a CPU-throttled signature trace and its resting state', async ({ page, browser }, testInfo) => {
  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await session.send('Tracing.start', { categories: 'devtools.timeline,blink.user_timing', transferMode: 'ReturnAsStream' });
  await page.goto('/');
  await expect(page.locator('.topology')).toHaveAttribute('data-motion-state', 'complete');
  const resting = await page.locator('.topology').getAttribute('style');
  // A second observation after the original six-second proposed pulse window guards against looping.
  const laterStyleChanges = await page.locator('.topology').evaluate(element => new Promise<number>(resolve => {
    let changes = 0;
    const observer = new MutationObserver(records => { changes += records.length; });
    observer.observe(element, { attributes: true, subtree: true, attributeFilter: ['style'] });
    setTimeout(() => { observer.disconnect(); resolve(changes); }, 6500);
  }));
  expect(laterStyleChanges).toBe(0);
  expect(await page.locator('.topology').getAttribute('style')).toBe(resting);
  await expect(page.locator('.topology')).toHaveAttribute('data-motion-state', 'complete');
  const completed = new Promise<{ stream?: string }>(resolve => session.once('Tracing.tracingComplete', resolve));
  await session.send('Tracing.end');
  const { stream } = await completed;
  if (!stream) throw new Error('Chrome did not return a performance trace stream');
  let trace = '';
  for (;;) {
    const chunk = await session.send('IO.read', { handle: stream });
    trace += chunk.data;
    if (chunk.eof) break;
  }
  await session.send('IO.close', { handle: stream });
  await writeFile(testInfo.outputPath('signature-trace.json'), trace);
  await testInfo.attach('CPU-throttled Chrome trace', { path: testInfo.outputPath('signature-trace.json'), contentType: 'application/json' });
  const events = (JSON.parse(trace) as { traceEvents: { name: string; dur?: number }[] }).traceEvents;
  const categories = ['Layout', 'Paint', 'FunctionCall'].map(name => {
    const durations = events.filter(event => event.name === name && event.dur !== undefined).map(event => event.dur! / 1000);
    return { name, count: durations.length, maxDurationMs: Math.max(0, ...durations), totalDurationMs: durations.reduce((sum, value) => sum + value, 0) };
  });
  await writeFile('docs/rebuild/captures/sprint3-motion-profile.json', JSON.stringify({
    browser: browser.version(), cpuThrottle: 4, network: 'local, unthrottled',
    configuredTimelineSeconds: 1.08, restingStateRecheckedAfterMs: 6500, categories,
    scope: 'Synthetic initial-load trace; not field Core Web Vitals or real-device frame-rate certification.',
  }, null, 2));
});
