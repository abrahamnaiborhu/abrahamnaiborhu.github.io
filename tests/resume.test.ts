import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("generated Resume is a two-page tagged PDF with a readable HTML alternative", () => {
  const pdf = readFileSync(
    new URL("../public/Abraham-Naiborhu-Resume.pdf", import.meta.url),
    "latin1",
  );
  assert.ok(pdf.startsWith("%PDF-"));
  // Chromium's generated PDF uses explicit page dictionaries; not a general PDF parser.
  assert.equal((pdf.match(/\/Type\s*\/Page\b/g) ?? []).length, 2);
  assert.ok(pdf.includes("/StructTreeRoot"));
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
