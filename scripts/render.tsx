import * as React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/App.tsx';

// Synchronous public content: no data fetching or Suspense in the build renderer.
// https://18.react.dev/reference/react-dom/server/renderToString
export function renderPage() {
  return renderToString(<React.StrictMode><App /></React.StrictMode>);
}

export function injectPage(template: string) {
  const marker = '<!--app-html-->';
  if (template.split(marker).length !== 2) {
    throw new Error('Expected exactly one app-html marker in the HTML template');
  }
  return template.replace(marker, () => renderPage());
}
