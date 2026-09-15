import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { profile } from "../src/rebrand/profile";
import { experience } from "../src/rebrand/experienceData";
import { capabilities } from "../src/rebrand/capabilities";
import { primaryCredentials, additionalCredential } from "../src/rebrand/credentials";
import { foundation, delivery, platform } from "../src/rebrand/projectData";

// Typeset from rules/Abraham Naiborhu.md plus confirmed identity/contact details.
// Uses audited public project summaries; the private rules directory is never shipped.
const css = `
*{box-sizing:border-box}body{margin:0;color:#17212b;background:#fff;font:15px/1.55 Arial,sans-serif}
main{max-width:850px;margin:40px auto;padding:0 28px}h1{font-size:32px;line-height:1.15;margin:0 0 8px}
h2{font-size:16px;letter-spacing:.08em;text-transform:uppercase;border-bottom:1px solid #b8c2cc;padding-bottom:6px;margin:28px 0 12px}
h3{font-size:16px;margin:16px 0 4px}p{margin:8px 0}a{color:#174d79;text-underline-offset:3px}
ul{padding-left:20px;margin:8px 0}li+li{margin-top:5px}.meta{color:#455362;font-size:13px}
.tools{display:flex;flex-wrap:wrap;gap:12px 24px;margin-bottom:24px}.tools a{padding:8px 0;min-height:44px}
:focus-visible{outline:2px solid #174d79;outline-offset:3px}article{break-inside:avoid}h2,h3{break-after:avoid}
@page{size:A4;margin:14mm 15mm}@media print{body{font-size:10pt;line-height:1.35}main{max-width:none;margin:0;padding:0}.tools{display:none}h1{font-size:24pt}h2{font-size:11pt;margin-top:14px}h3{font-size:11pt;margin-top:12px}p,ul{margin-block:6px}li+li{margin-top:3px}.meta{font-size:9pt}a{color:inherit;text-decoration:none}}
`;

function Resume() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Abraham Naiborhu — Resume</title>
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='8' fill='%230B0F14'/%3E%3Ctext x='12' y='35' font-family='sans-serif' font-size='32' fill='%23F8FAFC'%3EA%3C/text%3E%3C/svg%3E"
        />
        <style>{css}</style>
      </head>
      <body>
        <main>
          <nav className="tools" aria-label="Resume actions">
            <a href="/Abraham-Naiborhu-Resume.pdf" download>
              Download Resume (PDF)
            </a>
            <a href="/#contact">Contact Abraham</a>
            <a href="/">Back to portfolio</a>
          </nav>
          <header>
            <h1>{profile.name}</h1>
            <p>Application Engineer · Cloud &amp; Platform Engineering</p>
            <p className="meta">
              {profile.location} · <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <br />
              <a href={profile.linkedin}>LinkedIn</a> · <a href={profile.github}>GitHub</a> ·{" "}
              <a href={profile.writing}>Technical writing</a>
            </p>
          </header>
          <section>
            <h2>Summary</h2>
            <p>
              Google Cloud Certified Professional Cloud Architect and HashiCorp Certified Terraform
              Associate with hands-on experience designing Google Cloud infrastructure, implementing
              Terraform-based Infrastructure as Code (IaC), and building keyless CI/CD pipelines.
              Software engineering background spanning backend development, cloud operations,
              Kubernetes administration, and Site Reliability Engineering (SRE) practices.
            </p>
          </section>
          <section>
            <h2>Certifications &amp; skills</h2>
            <ul>
              {primaryCredentials.map((item) => (
                <li key={item.title}>
                  <a href={item.url}>{item.title}</a> — {item.issuer}
                </li>
              ))}
              <li>
                <a href={additionalCredential.url}>{additionalCredential.title}</a> — AWS Academy
                Graduate
              </li>
            </ul>
            {capabilities.map((group) => (
              <p key={group.title}>
                <strong>{group.title}:</strong> {group.technologies.join(", ")}.
              </p>
            ))}
          </section>
          <section>
            <h2>Technical portfolio &amp; architecture</h2>
            {[foundation, delivery, platform].map((project) => (
              <p key={project.id}>
                <strong>
                  <a href={project.article}>{project.title}</a>:
                </strong>{" "}
                {project.summary}
              </p>
            ))}
          </section>
          <section>
            <h2>Professional experience</h2>
            {experience.map((job) => (
              <article key={job.company}>
                <h3>
                  {job.role} — {job.company}
                </h3>
                <p className="meta">
                  {job.startLabel} — {job.endLabel} · {job.location}
                </p>
                <ul>
                  {job.highlights.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
          <section>
            <h2>Education</h2>
            <article>
              <h3>President University</h3>
              <p>B.Sc. Information Technology · August 2020–December 2023 · Cikarang</p>
              <ul>
                <li>Magna Cum Laude · GPA 3.95.</li>
                <li>
                  President University Scholarship Awardee — Academic &amp; Leadership Excellence.
                </li>
                <li>
                  Thesis: Real-Time Skin Lesion Classification with Deep Learning Integrated into
                  Android Application (Grade A).
                </li>
              </ul>
            </article>
            <article>
              <h3>Bangkit Academy</h3>
              <p>Mobile Development Cohort · 2022</p>
              <ul>
                <li>Graduated with Distinction — 98.5.</li>
                <li>
                  Co-developed an AI-driven plant disease detection application using Kotlin,
                  TensorFlow Lite, and GCP backend services; top 15 of 433 capstone teams.
                </li>
              </ul>
            </article>
          </section>
          <section>
            <h2>Languages</h2>
            <p>Indonesian — Native · English — Professional Working Proficiency</p>
          </section>
        </main>
      </body>
    </html>
  );
}

const html = "<!doctype html>" + renderToStaticMarkup(React.createElement(Resume));
await mkdir(new URL("../public/", import.meta.url), { recursive: true });
await writeFile(new URL("../public/resume.html", import.meta.url), html);
const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({
    path: new URL("../public/Abraham-Naiborhu-Resume.pdf", import.meta.url).pathname,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    tagged: true,
  });
} finally {
  await browser.close();
}
console.log("Generated public Resume HTML and PDF. Review both before committing.");
