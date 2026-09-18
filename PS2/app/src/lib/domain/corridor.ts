// The Punggol <-> one-north corridor: real stations and two real route
// options, built from:
//  - station coordinates: centroids computed from the polygons in
//    PS2/data/AmendmenttoMP2014RailStation.geojson (provided dataset — WGS84
//    lon/lat, no explicit CRS declared, confirmed by the coordinate range
//    against known Singapore geography)
//  - station sequence and line topology: North East Line and Circle Line,
//    stable public topology unchanged since the Circle Line loop closed in
//    2011 (cross-checked against Wikipedia's North East MRT line / Circle
//    MRT line station lists during development — see WRITEUP.md "Data
//    sources")
//
// This is a BOUNDED corridor demo, not an island-wide router: only stations
// on these two route options are modelled. See WRITEUP.md "Known limits".
//
// Inter-station running time is a DOCUMENTED ASSUMPTION (not a live feed):
// ~2.3 minutes per segment (typical published scheduled run+dwell time for
// NEL/CCL), transfer walk times estimated per interchange. All timings are
// shown to the user as ranges with this assumption disclosed, never as a
// single confident number.

import type { CanonicalLine, CorridorSegment, LineCode, RouteOption, Station } from "./types";

export const CANONICAL_LINES: CanonicalLine[] = [
  { canonical: "NEL", name: "North East Line", trainServiceAlertsCode: "NEL", pcdCode: "NEL" },
  { canonical: "CCL", name: "Circle Line", trainServiceAlertsCode: "CCL", pcdCode: "CCL" },
  { canonical: "PTL", name: "Punggol LRT", trainServiceAlertsCode: "PTL", pcdCode: "PLRT" },
  { canonical: "NSL", name: "North South Line", trainServiceAlertsCode: "NSL", pcdCode: "NSL" },
  { canonical: "EWL", name: "East West Line", trainServiceAlertsCode: "EWL", pcdCode: "EWL" },
  { canonical: "DTL", name: "Downtown Line", trainServiceAlertsCode: "DTL", pcdCode: "DTL" },
  { canonical: "TEL", name: "Thomson-East Coast Line", trainServiceAlertsCode: "TEL", pcdCode: "TEL" },
];

export function canonicalLineFor(alertLineCode: string): LineCode | null {
  const hit = CANONICAL_LINES.find(
    (l) => l.trainServiceAlertsCode.toUpperCase() === alertLineCode.toUpperCase()
  );
  return hit ? hit.canonical : null;
}

// Station coordinates: [lon, lat], extracted as polygon centroids from the
// provided GeoJSON (see scripts/extract-stations.md in WRITEUP.md for method).
export const STATIONS: Station[] = [
  { code: "NE17", name: "Punggol", coord: [103.902454, 1.405228], line: "NEL", interchange: ["PTL"] },
  { code: "NE16", name: "Sengkang", coord: [103.895332, 1.391359], line: "NEL", interchange: ["PTL"] },
  { code: "NE15", name: "Buangkok", coord: [103.893139, 1.382794], line: "NEL" },
  { code: "NE14", name: "Hougang", coord: [103.892486, 1.371142], line: "NEL" },
  { code: "NE13", name: "Kovan", coord: [103.885098, 1.360132], line: "NEL" },
  { code: "NE12", name: "Serangoon", coord: [103.872657, 1.350395], line: "NEL", interchange: ["CCL"] },
  { code: "NE11", name: "Woodleigh", coord: [103.870755, 1.339042], line: "NEL" },
  { code: "NE10", name: "Potong Pasir", coord: [103.869041, 1.331394], line: "NEL" },
  { code: "NE9", name: "Boon Keng", coord: [103.861419, 1.319116], line: "NEL" },
  { code: "NE8", name: "Farrer Park", coord: [103.854165, 1.312275], line: "NEL" },
  { code: "NE7", name: "Little India", coord: [103.849804, 1.307034], line: "NEL", interchange: ["DTL"] },
  { code: "NE6", name: "Dhoby Ghaut", coord: [103.845582, 1.299864], line: "NEL", interchange: ["CCL", "NSL"] },
  { code: "NE5", name: "Clarke Quay", coord: [103.846413, 1.288124], line: "NEL" },
  { code: "NE4", name: "Chinatown", coord: [103.843457, 1.284491], line: "NEL", interchange: ["DTL"] },
  { code: "NE3", name: "Outram Park", coord: [103.83949, 1.280066], line: "NEL", interchange: ["EWL", "TEL"] },
  { code: "NE1", name: "HarbourFront", coord: [103.821302, 1.265566], line: "NEL", interchange: ["CCL"] },

  { code: "CC29", name: "HarbourFront", coord: [103.821302, 1.265566], line: "CCL", interchange: ["NEL"] },
  { code: "CC28", name: "Telok Blangah", coord: [103.809791, 1.270596], line: "CCL" },
  { code: "CC27", name: "Labrador Park", coord: [103.803069, 1.272394], line: "CCL" },
  { code: "CC26", name: "Pasir Panjang", coord: [103.791261, 1.276197], line: "CCL" },
  { code: "CC25", name: "Haw Par Villa", coord: [103.781867, 1.282477], line: "CCL" },
  { code: "CC24", name: "Kent Ridge", coord: [103.784548, 1.293453], line: "CCL" },
  { code: "CC23", name: "one-north", coord: [103.787487, 1.299824], line: "CCL" },

  { code: "CC13", name: "Serangoon", coord: [103.872657, 1.350395], line: "CCL", interchange: ["NEL"] },
  { code: "CC14", name: "Lorong Chuan", coord: [103.864090, 1.351606], line: "CCL" },
  { code: "CC15", name: "Bishan", coord: [103.848170, 1.350636], line: "CCL", interchange: ["NSL"] },
  { code: "CC16", name: "Marymount", coord: [103.839478, 1.348637], line: "CCL" },
  { code: "CC17", name: "Caldecott", coord: [103.839573, 1.337558], line: "CCL", interchange: ["TEL"] },
  { code: "CC19", name: "Botanic Gardens", coord: [103.815019, 1.322073], line: "CCL", interchange: ["DTL"] },
  { code: "CC20", name: "Farrer Road", coord: [103.807614, 1.317588], line: "CCL" },
  { code: "CC21", name: "Holland Village", coord: [103.796167, 1.311774], line: "CCL" },
  { code: "CC22", name: "Buona Vista", coord: [103.789723, 1.307250], line: "CCL", interchange: ["EWL"] },
];

export function stationByCode(code: string): Station | undefined {
  return STATIONS.find((s) => s.code === code);
}

function segments(stations: string[], line: LineCode): CorridorSegment[] {
  const out: CorridorSegment[] = [];
  for (let i = 0; i < stations.length - 1; i++) {
    out.push({ from: stations[i], to: stations[i + 1], line });
  }
  return out;
}

const NEL_TRUNK = ["NE17", "NE16", "NE15", "NE14", "NE13", "NE12", "NE11", "NE10", "NE9", "NE8", "NE7", "NE6", "NE5", "NE4", "NE3", "NE1"];
const NEL_TO_SERANGOON = ["NE17", "NE16", "NE15", "NE14", "NE13", "NE12"];
const CCL_HARBOURFRONT_TO_ONENORTH = ["CC29", "CC28", "CC27", "CC26", "CC25", "CC24", "CC23"];
const CCL_SERANGOON_TO_ONENORTH = ["CC13", "CC14", "CC15", "CC16", "CC17", "CC19", "CC20", "CC21", "CC22", "CC23"];

export const ROUTE_OPTIONS: RouteOption[] = [
  {
    id: "via-harbourfront",
    label: "Via HarbourFront",
    stations: [...NEL_TRUNK, ...CCL_HARBOURFRONT_TO_ONENORTH.slice(1)],
    segments: [...segments(NEL_TRUNK, "NEL"), ...segments(CCL_HARBOURFRONT_TO_ONENORTH, "CCL")],
    interchanges: [{ at: "NE1", fromLine: "NEL", toLine: "CCL", walkMinutes: 4 }],
    description:
      "One-seat feel down the full North East Line to HarbourFront, then the Circle Line's southern arc to one-north. More stops, one large interchange.",
  },
  {
    id: "via-serangoon",
    label: "Via Serangoon",
    stations: [...NEL_TO_SERANGOON, ...CCL_SERANGOON_TO_ONENORTH.slice(1)],
    segments: [...segments(NEL_TO_SERANGOON, "NEL"), ...segments(CCL_SERANGOON_TO_ONENORTH, "CCL")],
    interchanges: [{ at: "NE12", fromLine: "NEL", toLine: "CCL", walkMinutes: 3 }],
    description:
      "Short hop on the North East Line to Serangoon, then the Circle Line's northern-then-western arc through Bishan and Holland Village. Fewer stops overall.",
  },
];

/** Minutes per inter-station segment — a disclosed scheduling assumption, not a live feed. */
export const ASSUMED_SEGMENT_MINUTES = 2.3;

/** Half of a documented assumed headway, used as expected wait at first boarding. */
export function assumedWaitMinutes(clock: string): number {
  const [h] = clock.split(":").map(Number);
  const isPeak = (h >= 7 && h < 9) || (h >= 18 && h < 20);
  return isPeak ? 2 : 3;
}
