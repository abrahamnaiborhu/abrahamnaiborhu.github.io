import { mkdir, writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test('record a CPU-throttled signature trace and its resting state', async ({ page, browser }, testInfo) => {
  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await session.send('Tracing.start', { categories: 'devtools.timeline,blink.user_timing', transferMode: 'ReturnAsStream' });
  await page.goto('/');
  await expect(page.locator('.opening')).toHaveAttribute('data-opening','complete');
  const portrait=page.locator('.opening-portrait');
  await expect(portrait).toHaveCSS('transform','none');
  expect(await portrait.evaluate(el=>el.getAnimations({subtree:true}).length)).toBe(0);
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
  await mkdir('docs/rebuild/production-captures',{recursive:true});
  await writeFile('docs/rebuild/production-captures/sprint4-motion-profile.json', JSON.stringify({
    browser: browser.version(), cpuThrottle: 4, network: 'local, unthrottled',
    configuredTimelineSeconds: 2.92, ambientLoop: 'Finite APN entrance; project loops pause off screen',
    ambientObservedForMs: 0, categories,
    scope: 'Synthetic initial-load trace; not field Core Web Vitals or real-device frame-rate certification.',
  }, null, 2));
});
