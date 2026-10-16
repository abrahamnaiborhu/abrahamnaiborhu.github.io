import type { ReactNode } from 'react';

export type Attrs = Record<string, string | number>;
export type Parts = Record<string, Attrs>;

export interface SceneDefinition {
  id: string;
  states: readonly [string, string, string];
  /** Progress where the caption changes to the second and third state. */
  thresholds: readonly [number, number];
  /** Progress at which each state is complete; used for still frames. */
  settled: readonly [number, number, number];
  captions: readonly [string, string, string];
  /** Accessible description of the drawing in each state. */
  alts: readonly [string, string, string];
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
export const stateIndex = (scene: SceneDefinition, p: number) => (p < scene.thresholds[0] ? 0 : p < scene.thresholds[1] ? 1 : 2);
/** Old value fades out completely before the new one fades in, so numerals never overlap. */
export const swap = (p: number, from: number, to: number) => {
  const middle = (from + to) / 2;
  return { out: 1 - segment(p, from, middle), in: segment(p, middle, to) };
};
/** Stroke drawn from 0 (hidden) to 1 (complete) on a path with pathLength="1". */
export const drawn = (t: number): Attrs => ({ strokeDashoffset: fixed(1 - t) });
