import { ArrowIcon } from "../components/ArrowIcon";
import { CareerReel } from "./CareerReel";
import { primaryCredentials, additionalCredential } from "../rebrand/credentials";
import { articles } from "../rebrand/articles";
import { PublicEngineeringDeck } from "./PublicEngineeringDeck";
import { capabilities } from "../rebrand/capabilities";
import { profile } from "../rebrand/profile";

export function Evidence() {
  return (
    <div className="evidence" aria-labelledby="evidence-title">
      <div className="evidence-index">
        <p className="eyebrow">Evidence</p>
        <h2 id="evidence-title">More of the work, if you want depth.</h2>
        <nav aria-label="Evidence">
          <a href="#cloud-work">Public cloud work</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#experience">Career</a>
          <a href="#certifications">Certifications</a>
          <a href="#writing">Writing</a>
          <a href="#about">About</a>
        </nav>
      </div>
      <section id="cloud-work" className="evidence-section" aria-labelledby="cloud-title">
        <p className="eyebrow">Public engineering work</p>
        <h2 id="cloud-title">The decisions behind the implementation.</h2>
        <p>Public cloud projects and writing provide another way to explore my work.</p>
        <PublicEngineeringDeck />
      </section>
      <section id="capabilities" className="evidence-section" aria-labelledby="capabilities-title">
        <p className="eyebrow">Tools across the work</p>
        <h2 id="capabilities-title">
          An application foundation. <br /> An infrastructure focus.
        </h2>
        <p className="evidence-range">Mobile · Web · Desktop · ERP · IoT · Machine learning</p>
        <dl className="capability-list">
          {capabilities.map((group) => (
            <div key={group.title}>
              <dt>{group.title}</dt>
              <dd>{group.technologies.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section
        id="experience"
        tabIndex={-1}
        className="evidence-section"
        aria-labelledby="experience-title"
      >
        <p className="eyebrow">Experience</p>
        <h2 id="experience-title">The work that brought me here.</h2>
        <CareerReel />
      </section>
      <section
        id="certifications"
        className="evidence-section"
        aria-labelledby="certifications-title"
      >
        <p className="eyebrow">Certifications</p>
        <h2 id="certifications-title">Learning, with something to show for it.</h2>
        <ul className="certification-grid">
          {primaryCredentials.map((credential) => (
            <li key={credential.title}>
              <p className="eyebrow">{credential.issuer}</p>
              <h3>{credential.title}</h3>
              <a href={credential.url} aria-label={`View credential: ${credential.title}`}>
                View credential <ArrowIcon />
              </a>
            </li>
          ))}
        </ul>
        <p className="secondary-credential">
          Additional training{" "}
          <a href={additionalCredential.url}>
            {additionalCredential.title} <ArrowIcon />
          </a>
        </p>
      </section>
      <section
        id="writing"
        tabIndex={-1}
        className="evidence-section"
        aria-labelledby="writing-title"
      >
        <p className="eyebrow">Engineering notes</p>
        <h2 id="writing-title">I write down the decisions.</h2>
        <ol className="writing-list">
          {articles.map((article, index) => (
            <li key={article.url}>
              <a className="writing-row" href={article.url}>
                <span className="writing-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{article.title}</h3>
                  <p>{article.topics}</p>
                </div>
                <span className="writing-arrow" aria-hidden="true">
                  <ArrowIcon />
                </span>
              </a>
            </li>
          ))}
        </ol>
        <a href={profile.writing}>
          Read all articles on Dev.to <ArrowIcon />
        </a>
      </section>
      <section id="about" tabIndex={-1} className="evidence-section" aria-labelledby="about-title">
        <p className="eyebrow">Beyond the work</p>
        <h2 id="about-title">A little more about me.</h2>
        <div className="about-grid">
          <div>
            <p>
              I started in software and enterprise application development. That background shapes
              how I approach platform work: I care about the developer experience and the
              infrastructure that supports it.
            </p>
            <p>
              My focus is on making systems feel seamless and interconnected, while thinking through
              failure, recovery and cost.
            </p>
          </div>
          <div className="education">
            <h3>President University</h3>
            <p>B.Sc. Information Technology · 2020–2023</p>
            <p>
              Magna Cum Laude · GPA 3.95
              <br />
              Scholarship Awardee · Thesis Grade A
            </p>
            <h3>Bangkit Academy</h3>
            <p>
              Mobile Development Cohort · 2022
              <br />
              Distinction — 98.5
              <br />
              Top 15 / 433 capstone teams
            </p>
            <h3>Languages</h3>
            <dl className="languages">
              <div>
                <dt>Indonesian</dt>
                <dd>Native</dd>
              </div>
              <div>
                <dt>English</dt>
                <dd>Professional Working Proficiency</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
