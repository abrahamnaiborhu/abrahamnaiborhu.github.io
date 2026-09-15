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

test('foundation case study exposes evidence and a text-equivalent architecture without JavaScript', () => {
  const html = renderPage();
  assert.ok(html.includes('GCP Terraform Foundation'));
  assert.ok(html.includes('https://github.com/abrahamnaiborhu/GCP-Terraform-Foundation-Lite'));
  assert.ok(html.includes('Object versioning'));
  assert.ok(html.includes('not a full landing zone'));
  assert.ok(html.includes('aria-labelledby="foundation-title"'));
});

test('three evidence-led projects include distinct delivery and traffic explanations', () => {
  const html = renderPage();
  assert.equal((html.match(/<article\b/g) ?? []).length, 3);
  assert.ok(html.includes('Keyless CI/CD on Google Cloud'));
  assert.ok(html.includes('Production-Lite GCP Web Platform'));
  assert.ok(html.includes('PR plan is for review'));
  assert.ok(html.includes('Outbound only'));
  assert.ok(!html.includes('highly available'));
  assert.ok(!html.includes('On-Prem Kubernetes'));
});

test('capabilities include four named groups and approved technologies before Work', () => {
  const html = renderPage();
  const start = html.indexOf('id="capabilities"');
  const end = html.indexOf('id="work"');
  assert.ok(start > 0 && end > start);
  const section = html.slice(start, end);
  assert.equal((section.match(/<h3\b/g) ?? []).length, 4);
  for (const name of ['Cloud Infrastructure', 'Platform &amp; DevOps', 'Kubernetes &amp; Linux', 'Software Engineering', 'Cloud Run', 'GitLab CI/CD', 'Kustomize', 'Prisma']) {
    assert.ok(section.includes(name), name);
  }
});

test('career and certifications include approved history without invented verification links', () => {
  const html = renderPage();
  for (const text of ['Oracle NetSuite Technical Consultant', 'Hand Global Solutions', 'VB.NET Developer', 'Indomaret Group', 'Software Engineer Intern', 'PT Mattel Indonesia', '11 internal applications', 'AWS Academy Cloud Foundations']) {
    assert.ok(html.includes(text), text);
  }
  assert.match(html, /datetime="2022-11"/i);
  const certifications = html.slice(html.indexOf('id="certifications"'), html.indexOf('id="writing"'));
  assert.equal((certifications.match(/<h3\b/g) ?? []).length, 4);
  assert.ok(!certifications.includes('<a '));
});

test('writing exposes four curated articles and the author archive without JavaScript', () => {
  const html = renderPage();
  const section = html.slice(html.indexOf('id="writing"'), html.indexOf('id="about"'));
  assert.equal((section.match(/<h3\b/g) ?? []).length, 4);
  assert.equal((section.match(/href="https:\/\/dev.to\/abrahamnaiborhu\//g) ?? []).length, 4);
  assert.ok(section.includes('Terraform Drift Detection and Recovery on Google Cloud: Plan, Import, State, and GitHub Actions'));
  assert.ok(section.includes('Read all articles on Dev.to'));
  assert.ok(!section.includes('<img'));
});

test('about and contact show supplied education, languages, identity, and safe contact fallback', () => {
  const html = renderPage();
  for (const text of ['President University', 'GPA 3.95', 'Bangkit Academy', 'Top 15 / 433', 'Professional Working Proficiency', 'Email Abraham', profile.name]) {
    assert.ok(html.includes(text), text);
  }
  assert.ok(!html.includes('href="tel:'));
  assert.ok(!html.includes('CV.pdf'));
  assert.ok(html.includes('id="resume-note"'));
});

test('HTML injection fails loudly when its single template marker is missing or duplicated', () => {
  assert.throws(() => injectPage('<div></div>'), /marker/i);
  assert.throws(() => injectPage('<!--app-html--><!--app-html-->'), /marker/i);
  const html = injectPage('<main><!--app-html--></main>');
  assert.ok(html.includes(profile.headline));
  assert.ok(!html.includes('<!--app-html-->'));
});
