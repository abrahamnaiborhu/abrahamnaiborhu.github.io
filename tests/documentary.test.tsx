import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderPage } from '../scripts/render.tsx';

test('APN keeps its five strokes without normalized dash lengths that hide the P in WebKit', () => {
  const html = renderPage();
  const mark = html.match(/<svg class="apn-mark"[\s\S]*?<\/svg>/)?.[0];
  assert.ok(mark);
  assert.equal((mark.match(/data-stroke=/g) ?? []).length, 5);
  assert.ok(mark.includes('data-stroke="p-bowl"'));
  assert.ok(!/pathLength="1"/.test(mark), 'APN must use measured SVG lengths for its drawing animation');
});

test('interface arrows use decorative vectors rather than emoji-capable text', () => {
  const html = renderPage();
  assert.doesNotMatch(html, /[↗↘↓↑→]/u, 'Arrow glyphs must not depend on platform text/emoji presentation');
  const arrows = [...html.matchAll(/<svg\b[^>]*class="ui-arrow"[^>]*>/g)];
  assert.ok(arrows.length >= 30, 'Navigation, projects, evidence and contact must use the shared arrows');
  for (const [arrow] of arrows) {
    assert.match(arrow, /aria-hidden="true"/);
    assert.match(arrow, /focusable="false"/);
    assert.match(arrow, /stroke="currentColor"/);
  }
});

test('documentary story exposes contribution, platform scope and limits before JavaScript', () => {
  const html = renderPage();
  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  for (const text of ['I like making things', 'Sattabi', 'AVAD', 'Glinsta', 'Employer-owned', 'development and staging', '10 applications', '11 developers', 'Backup and restore validation', 'separate backup destination']) {
    assert.ok(textContent.includes(text), text);
  }
  assert.ok(!/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(html), 'Network addresses must not enter the portfolio');
  assert.ok(!/\b[a-z]+-(?:nonprod|staging)-\d{3}\b/i.test(html), 'Internal node identifiers must not enter the portfolio');
  assert.ok(!html.includes('99.9%'), 'Do not turn availability aspirations into claims');
});

test('documentary product illustrations explain actions with accessible unique names', () => {
  const html = renderPage();
  for (const text of ['reader', 'controller', 'presentation', 'workspace']) assert.ok(html.toLowerCase().includes(text));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'SVG and chapter IDs must be unique');
  for (const [, names] of html.matchAll(/aria-labelledby="([^"]+)"/g)) {
    for (const id of names.split(' ')) assert.ok(ids.includes(id), `Missing accessible label ${id}`);
  }
});

test('failure and recovery scenes ship complete still frames, captions and accounts before JavaScript', () => {
  const html = renderPage();
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  for (const text_ of [
    'I build applications that keep working when part of them',
    'Each door keeps its own copy of who may enter',
    'I chose WebSocket',
    'Exactly one account',
    'When something broke, it simply broke',
    'One problem is still open',
    'key override',
    'Each shared screen is pinged on its own',
    'without creating a duplicate account',
    'On the platform, that question is still open',
  ]) assert.ok(text.includes(text_), text_);
  for (const id of ['sattabi', 'avad', 'glinsta']) {
    const scene = html.slice(html.indexOf(`id="${id}"`), html.indexOf(`id="${id}-account"`));
    assert.equal((scene.match(/class="scene-svg"/g) ?? []).length, 4, `${id}: live drawing plus its settled story frames`);
    assert.ok(scene.includes('class="scene-still"'), `${id}: still frames are server-rendered`);
  }
  assert.ok(!html.includes('project-motion'), 'Looping illustrations and their pause control are retired');
  assert.ok(html.indexOf('id="contact"') < html.indexOf('id="cloud-work"'), 'Contact follows the story before the evidence collection');
});
