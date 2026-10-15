import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App.tsx';

// Both development and production inject the same App before hydration.
// https://18.react.dev/reference/react-dom/client/hydrateRoot
const root = document.getElementById('root');
if (!root) throw new Error('Missing application root');
hydrateRoot(root, <StrictMode><App /></StrictMode>);
