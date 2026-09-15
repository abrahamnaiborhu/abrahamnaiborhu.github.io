import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import App from './App.tsx';

// Register ScrollTrigger in the browser entry before hydration.
// The static renderer (Node) never reaches this file.
gsap.registerPlugin(ScrollTrigger);

// Both development and production inject the same App before hydration.
// https://18.react.dev/reference/react-dom/client/hydrateRoot
const root = document.getElementById('root');
if (!root) throw new Error('Missing application root');
hydrateRoot(root, <StrictMode><App /></StrictMode>);
