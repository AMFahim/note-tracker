const UNIT_SECONDS = { s: 1, m: 60, h: 3600, d: 86400 } as const;

export function durationToSeconds(duration: string): number {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) {
    throw new Error(`Invalid duration "${duration}"`);
  }
  const [, amount, unit] = match;
  return Number(amount) * UNIT_SECONDS[unit as keyof typeof UNIT_SECONDS];
}
