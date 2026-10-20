import type { ReactNode } from 'react';

export type Attrs = Record<string, string | number>;
export type Parts = Record<string, Attrs>;

export interface SceneDefinition {
  id: string;
  states: readonly string[];
  /** Editorial words and direct beat controls for the product film. */
  words?: readonly string[];
  /** Progress boundaries between successive states. */
  thresholds: readonly number[];
  /** Progress at which each state is complete; used for still frames. */
  settled: readonly number[];
  captions: readonly string[];
  /** Accessible description of the drawing in each state. */
  alts: readonly string[];
  parts: (p: number) => Parts;
  /** Unpinned layouts: follow the drawing's centre (default), or spread over the full height of tall content. */
  flowAnchor?: 'center' | 'span';
  /** false keeps the scene in normal flow on every screen size. */
  pinnable?: boolean;
  Drawing: (props: { a: Parts }) => ReactNode;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const segment = (p: number, from: number, to: number) => clamp((p - from) / (to - from));
export const ease = (t: number) => t * t * (3 - 2 * t);
export const fixed = (value: number) => Math.round(value * 1000) / 1000;
export const stateIndex = (scene: SceneDefinition, p: number) => {
  const next = scene.thresholds.findIndex(threshold => p < threshold);
  return next < 0 ? scene.states.length - 1 : next;
};
/** Old value fades out completely before the new one fades in, so numerals never overlap. */
export const swap = (p: number, from: number, to: number) => {
  const middle = (from + to) / 2;
  return { out: 1 - segment(p, from, middle), in: segment(p, middle, to) };
};
/** Stroke drawn from 0 (hidden) to 1 (complete) on a path with pathLength="1". */
export const drawn = (t: number): Attrs => ({ strokeDashoffset: fixed(1 - t) });
