import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("published Resume uses the approved two-page tagged PDF with a readable HTML alternative", () => {
  const source = readFileSync(new URL("../docs/Abraham Naiborhu.pdf", import.meta.url));
  const published = readFileSync(new URL("../public/Abraham-Naiborhu-Resume.pdf", import.meta.url));
  assert.deepEqual(published, source);
  const pdf = published.toString("latin1");
  assert.ok(pdf.startsWith("%PDF-"));
  // The approved PDF uses explicit page dictionaries; this is not a general PDF parser.
  assert.equal((pdf.match(/\/Type\s*\/Page\b/g) ?? []).length, 2);
  assert.ok(pdf.includes("/StructTreeRoot"));
  assert.ok(pdf.includes("/Title (Abraham Naiborhu)"));
  const html = readFileSync(new URL("../public/resume.html", import.meta.url), "utf8");
  for (const text of [
    "Abraham Naiborhu",
    "Application Engineer",
    "President University",
    "Professional Working Proficiency",
    "Download Resume (PDF)",
  ])
    assert.ok(html.includes(text));
  assert.ok(!html.includes("<script"));
});
