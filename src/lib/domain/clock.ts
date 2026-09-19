// Small HH:mm clock-arithmetic helpers. Deliberately not using Date objects
// for trip-relative math — trips are planned within a single service day.

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function fromMinutes(total: number): string {
  const t = ((Math.round(total) % 1440) + 1440) % 1440;
  const h = Math.floor(t / 60);
  const m = t % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function addMinutes(hhmm: string, delta: number): string {
  return fromMinutes(toMinutes(hhmm) + delta);
}

export function diffMinutes(a: string, b: string): number {
  return toMinutes(b) - toMinutes(a);
}

export function isAfter(a: string, b: string): boolean {
  return toMinutes(a) > toMinutes(b);
}

export function isBeforeOrEqual(a: string, b: string): boolean {
  return toMinutes(a) <= toMinutes(b);
}

export function midpoint([lo, hi]: [number, number]): number {
  return (lo + hi) / 2;
}

export function rangeAtClock(hhmm: string, [lo, hi]: [number, number]): [string, string] {
  return [addMinutes(hhmm, lo), addMinutes(hhmm, hi)];
}
