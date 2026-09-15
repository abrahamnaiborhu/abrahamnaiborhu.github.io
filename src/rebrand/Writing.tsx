import * as React from 'react';
import { articles } from './articles';
import { profile } from './profile';

export function Writing() {
  return <React.Fragment>
    <section id="writing" tabIndex={-1} className="section wrap" aria-labelledby="writing-title">
      <p className="eyebrow">Technical writing</p>
      <h2 id="writing-title">Documenting the engineering decisions behind the implementation.</h2>
      <p>Architecture notes, infrastructure experiments, and implementation breakdowns covering Google Cloud, Terraform, CI/CD, DevOps, and SRE practices.</p>
      <ol className="writing-list">
        {articles.map((article, index) => <li key={article.url}>
          <a className="writing-row" href={article.url} aria-labelledby={`article-title-${index}`}>
            <span className="writing-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div><h3 id={`article-title-${index}`}>{article.title}</h3><p>{article.topics}</p></div>
            <span className="writing-arrow" aria-hidden="true">↗</span>
          </a>
        </li>)}
      </ol>
      <a className="text-link" href={profile.writing}>Read all articles on Dev.to <span aria-hidden="true">↗</span></a>
    </section>
  </React.Fragment>;
}
