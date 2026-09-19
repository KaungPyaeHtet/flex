// Client-side cache for the currently selected journey, its instructions and
// previously computed alternatives — kept readable offline with an explicit
// staleness warning (PS2_README.md 3.2 "Respond to change" / "Prepare
// before departure"). This is plain localStorage, not the service worker
// cache: it holds one JSON blob with its own fetchedAt, so the UI can always
// say precisely how old what it's showing is, and never silently implies
// new conditions have been checked while offline.

import type { PlanResult, TripRequest } from "@/lib/domain/types";

const PLAN_KEY = "flex:lastPlan:v1";
const SAVED_TRIP_KEY = "flex:savedTrip:v1";

export interface CachedPlan {
  result: PlanResult;
  cachedAt: string;
}

export function cachePlan(result: PlanResult) {
  try {
    const payload: CachedPlan = { result, cachedAt: new Date().toISOString() };
    localStorage.setItem(PLAN_KEY, JSON.stringify(payload));
  } catch {
    // Storage unavailable (private mode, quota) — offline fallback simply won't have data.
  }
}

export function readCachedPlan(): CachedPlan | null {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    return raw ? (JSON.parse(raw) as CachedPlan) : null;
  } catch {
    return null;
  }
}

export function saveTrip(request: TripRequest) {
  try {
    localStorage.setItem(SAVED_TRIP_KEY, JSON.stringify(request));
  } catch {
    /* ignore */
  }
}

export function readSavedTrip(): TripRequest | null {
  try {
    const raw = localStorage.getItem(SAVED_TRIP_KEY);
    return raw ? (JSON.parse(raw) as TripRequest) : null;
  } catch {
    return null;
  }
}

export function clearSavedTrip() {
  try {
    localStorage.removeItem(SAVED_TRIP_KEY);
  } catch {
    /* ignore */
  }
}

/** Freshness thresholds, minutes, disclosed in the UI rather than hidden. */
export const STALE_THRESHOLD_MINUTES = {
  alerts: 30,
  crowdForecast: 360, // published once/24h, so treated stale only after 6h
  weather: 45,
  cachedPlan: 20,
};

export function minutesSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / 60000;
}
