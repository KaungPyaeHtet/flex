// Arjun's editable example trip — real, verifiable endpoints so judges (or
// anyone) can try the app with zero setup.
//
//  - Origin: near Soo Teck LRT Station, Punggol. Coordinate is the polygon
//    centroid for "SOO TECK" in the provided
//    PS2/data/AmendmenttoMP2014RailStation.geojson (an LRT stop on the
//    Punggol loop, not a private address).
//  - Destination: Fusionopolis One, one-north — a real, named building in
//    the one-north business park, geocoded via OpenStreetMap Nominatim
//    (© OpenStreetMap contributors) during development.

import type { GeoPoint, TripRequest } from "./types";

export const ARJUN_ORIGIN: GeoPoint = {
  label: "Near Soo Teck LRT, Punggol",
  coord: [103.897229, 1.405145],
};

export const ARJUN_DESTINATION: GeoPoint = {
  label: "Fusionopolis One, one-north",
  coord: [103.7900874, 1.2982805],
};

/** Punggol MRT/LRT interchange — the real first station of both route options. */
export const CORRIDOR_ORIGIN_STATION: [number, number] = [103.902454, 1.405228];
/** one-north MRT station — the real last station of both route options. */
export const CORRIDOR_DEST_STATION: [number, number] = [103.787487, 1.299824];

export function buildDefaultTripRequest(dateISO: string): TripRequest {
  return {
    origin: ARJUN_ORIGIN,
    destination: ARJUN_DESTINATION,
    date: dateISO,
    earliestDeparture: "07:15",
    latestArrival: "09:00",
    preferences: {
      comfortWeight: 0.7,
      walkToleranceMinutes: 15,
      cycleToleranceMinutes: 20,
      allowCycleAndPark: true,
      allowFoldingBikeCarry: false,
    },
  };
}
