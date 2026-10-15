import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderPage } from '../scripts/render.tsx';

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
