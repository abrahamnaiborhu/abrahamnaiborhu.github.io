import { writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

type TraceEvent = { name: string; dur?: number };

function percentile(values: number[], fraction: number) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)];
}

test('profile full-page motion and drawer interaction under 4x CPU throttle', async ({ page, browser }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text());
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const metrics = { cls: 0, lcpMs: 0, longTasks: [] as number[], interactions: [] as number[] };
    Object.defineProperty(window, '__sprint5Metrics', { value: metrics });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) metrics.lcpMs = entry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!shift.hadRecentInput) metrics.cls += shift.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) metrics.longTasks.push(entry.duration);
    }).observe({ type: 'longtask', buffered: true });
    const eventOptions: PerformanceObserverInit & { durationThreshold: number } = { type: 'event', buffered: true, durationThreshold: 16 };
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) metrics.interactions.push(entry.duration);
    }).observe(eventOptions);
  });

  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await session.send('Tracing.start', {
    categories: 'devtools.timeline,disabled-by-default-devtools.timeline,blink.user_timing,toplevel',
    transferMode: 'ReturnAsStream',
  });
  await page.goto('/');
  await expect(page.locator('.topology')).toHaveAttribute('data-motion-state', 'complete');

  const scroll = await page.evaluate(() => new Promise<{ distancePx: number; elapsedMs: number; intervals: number[] }>(resolve => {
    const startY = scrollY;
    const initialTargetY = document.documentElement.scrollHeight - innerHeight;
    const duration = 5000;
    const timestamps: number[] = [];
    let startedAt = 0;
    const step = (timestamp: number) => {
      if (!startedAt) startedAt = timestamp;
      timestamps.push(timestamp);
      const progress = Math.min(1, (timestamp - startedAt) / duration);
      const targetY = document.documentElement.scrollHeight - innerHeight;
      scrollTo(0, startY + (targetY - startY) * progress);
      if (progress < 1) requestAnimationFrame(step);
      else resolve({
        distancePx: Math.max(initialTargetY, targetY) - startY,
        elapsedMs: timestamp - startedAt,
        intervals: timestamps.slice(1).map((value, index) => value - timestamps[index]),
      });
    };
    requestAnimationFrame(step);
  }));
  await expect(page.locator('#contact')).toBeInViewport();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#home').scrollIntoViewIfNeeded();
  await page.getByText('Menu', { exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Navigation' })).not.toBeVisible();

  const observed = await page.evaluate(() => (window as typeof window & {
    __sprint5Metrics: { cls: number; lcpMs: number; longTasks: number[]; interactions: number[] };
  }).__sprint5Metrics);
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
  await writeFile(testInfo.outputPath('sprint5-full-scroll-trace.json'), trace);
  await testInfo.attach('4x CPU full-scroll trace', { path: testInfo.outputPath('sprint5-full-scroll-trace.json'), contentType: 'application/json' });

  const events = (JSON.parse(trace) as { traceEvents: TraceEvent[] }).traceEvents;
  const categories = ['Layout', 'Paint', 'FunctionCall', 'RunTask'].map(name => {
    const durations = events.filter(event => event.name === name && event.dur !== undefined).map(event => event.dur! / 1000);
    return {
      name,
      count: durations.length,
      over50ms: durations.filter(duration => duration > 50).length,
      maxDurationMs: Math.max(0, ...durations),
      totalDurationMs: durations.reduce((sum, duration) => sum + duration, 0),
    };
  });
  const intervalP95Ms = percentile(scroll.intervals, 0.95);
  const report = {
    browser: browser.version(),
    cpuThrottle: 4,
    network: 'local, unthrottled',
    viewport: '1440x900 scroll; 390x844 drawer',
    scroll: {
      distancePx: Math.round(scroll.distancePx),
      elapsedMs: Math.round(scroll.elapsedMs),
      sampledFrames: scroll.intervals.length,
      intervalMedianMs: Number(percentile(scroll.intervals, 0.5).toFixed(2)),
      intervalP95Ms: Number(intervalP95Ms.toFixed(2)),
      intervalMaxMs: Number(Math.max(0, ...scroll.intervals).toFixed(2)),
      framesWithin20msPercent: Number((100 * scroll.intervals.filter(interval => interval <= 20).length / scroll.intervals.length).toFixed(1)),
    },
    observed: {
      cls: observed.cls,
      lcpMs: Math.round(observed.lcpMs),
      longTaskCount: observed.longTasks.length,
      maxLongTaskMs: Number(Math.max(0, ...observed.longTasks).toFixed(2)),
      maxInteractionMs: Number(Math.max(0, ...observed.interactions).toFixed(2)),
    },
    categories,
    scope: 'Synthetic local Chrome stress recording. Frame intervals cover scripted full-page scroll; not field CWV or physical-device certification.',
  };
  await writeFile('docs/rebuild/captures/sprint5-performance-profile.json', JSON.stringify(report, null, 2));

  expect(errors).toEqual([]);
  expect(observed.cls).toBeLessThan(0.1);
  expect(intervalP95Ms).toBeLessThan(34);
});
