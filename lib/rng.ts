// Deterministic PRNG so server-rendered HTML matches client hydration exactly.
// Never use Math.random() in mock data — it causes hydration mismatches.

export function makeRng(seed: number) {
  let s = seed >>> 0;
  return function rng(): number {
    // mulberry32
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = () => number;

export const randInt = (rng: Rng, min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;

export const pick = <T,>(rng: Rng, arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];

export function pickMany<T>(rng: Rng, arr: readonly T[], count: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  }
  return out;
}

export const chance = (rng: Rng, probability: number) => rng() < probability;

/** Stable "now" anchor so relative dates never drift between render and hydration. */
export const NOW = new Date("2026-09-30T12:00:00Z").getTime();
export const DAY = 86_400_000;

export const daysAgo = (days: number, jitterHours = 0) =>
  new Date(NOW - days * DAY - jitterHours * 3_600_000).toISOString();

export const daysAhead = (days: number) => new Date(NOW + days * DAY).toISOString();
