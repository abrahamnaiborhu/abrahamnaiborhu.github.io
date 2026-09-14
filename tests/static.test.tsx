import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderPage, injectPage } from '../scripts/render.tsx';
import { profile } from '../src/rebrand/profile.ts';

test('static output contains one heading and approved public content before JavaScript', () => {
  const html = renderPage();
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(html.includes(profile.headline));
  assert.ok(html.includes(profile.role));
  assert.ok(html.includes('href="#work"'));
  assert.ok(html.includes(`href="mailto:${profile.email}"`));
  assert.ok(!html.includes('CV.pdf'), 'Do not ship the obsolete résumé');
});

test('every internal navigation destination exists exactly once', () => {
  const html = renderPage();
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.equal((html.match(new RegExp(`id="${id}"`, 'g')) ?? []).length, 1, id);
  }
});

test('HTML injection fails loudly when its single template marker is missing or duplicated', () => {
  assert.throws(() => injectPage('<div></div>'), /marker/i);
  assert.throws(() => injectPage('<!--app-html--><!--app-html-->'), /marker/i);
  const html = injectPage('<main><!--app-html--></main>');
  assert.ok(html.includes(profile.headline));
  assert.ok(!html.includes('<!--app-html-->'));
});
