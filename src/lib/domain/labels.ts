import { ROUTE_OPTIONS } from "./corridor";
import type { AccessMode } from "./types";

export function routeLabel(routeOptionId: string): string {
  return ROUTE_OPTIONS.find((r) => r.id === routeOptionId)?.label ?? routeOptionId;
}

export const ACCESS_MODE_LABEL: Record<AccessMode, string> = {
  walk: "Walk to Punggol",
  cycle_park: "Cycle & park at Punggol",
  cycle_carry_folding: "Cycle, carry folding bike",
};

export function formatDuration(range: [number, number]): string {
  const [lo, hi] = range.map(Math.round);
  return lo === hi ? `${lo} min` : `${lo}–${hi} min`;
}
