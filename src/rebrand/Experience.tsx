import * as React from 'react';
import { experience } from './experienceData';

export function Experience() {
  return <React.Fragment>
    <section id="experience" tabIndex={-1} className="section wrap" aria-labelledby="experience-title">
      <p className="eyebrow">Experience</p>
      <h2 id="experience-title">From software engineering to cloud and platform ownership.</h2>
      <ol className="career-timeline">
        {experience.map(job => <li key={job.company} className={job.end === null ? 'current-role' : undefined}>
          <p className="career-date"><time dateTime={job.start}>{job.startLabel}</time> — {job.end ? <time dateTime={job.end}>{job.endLabel}</time> : job.endLabel}<span> · {job.location}</span></p>
          <h3>{job.role}</h3>
          <p className="career-company">{job.company}</p>
          <ul className="career-highlights">{job.highlights.map(text => <li key={text}>{text}</li>)}</ul>
        </li>)}
      </ol>
    </section>
  </React.Fragment>;
}
