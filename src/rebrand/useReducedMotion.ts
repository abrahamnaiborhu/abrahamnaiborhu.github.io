import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
const serverSnapshot = () => true;
const clientSnapshot = () => typeof window.matchMedia !== 'function' || window.matchMedia(query).matches;

function subscribe(onChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {};
  const preference = window.matchMedia(query);
  preference.addEventListener('change', onChange);
  return () => preference.removeEventListener('change', onChange);
}

// Stable, conservative server snapshot prevents hydration mismatches.
// https://18.react.dev/reference/react/useSyncExternalStore
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
}
