"use client";

import dynamic from "next/dynamic";
import type { CandidateEvaluation, GeoPoint } from "@/lib/domain/types";

// Leaflet touches `window` at import time, so the map must never run during
// SSR — dynamic import with ssr:false keeps it out of the server bundle.
const RouteMapInner = dynamic(() => import("./RouteMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-text-muted">Loading map…</div>
  ),
});

export default function RouteMap(props: {
  origin: GeoPoint;
  destination: GeoPoint;
  candidate: CandidateEvaluation;
  disruptedStations: Set<string>;
}) {
  return (
    <div className="h-[46vh] min-h-[280px] w-full overflow-hidden rounded-2xl border border-border">
      <RouteMapInner {...props} />
    </div>
  );
}
