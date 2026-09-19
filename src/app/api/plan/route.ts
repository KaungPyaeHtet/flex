import { NextResponse } from "next/server";
import { planTrip } from "@/lib/domain/planTrip";
import { fetchTrainServiceAlerts } from "@/lib/data/trainAlerts";
import { fetchCrowdForecast } from "@/lib/data/crowding";
import { fetchWeatherFor } from "@/lib/data/weather";
import { walkLeg, cycleLeg, haversineKm } from "@/lib/data/osrm";
import { CORRIDOR_ORIGIN_STATION, CORRIDOR_DEST_STATION } from "@/lib/domain/defaultTrip";
import type { ScenarioId } from "@/fixtures/trainAlerts";
import type { CrowdForecastEntry, TripRequest } from "@/lib/domain/types";

export const dynamic = "force-dynamic";

const MAX_ACCESS_KM = 6; // bounded-corridor disclosure threshold — see WRITEUP.md "Known limits"

interface PlanApiBody {
  request: TripRequest;
  scenario?: ScenarioId;
  simulateStale?: boolean;
}

export async function POST(req: Request) {
  let body: PlanApiBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { request, scenario = "normal", simulateStale = false } = body;
  if (!request?.origin?.coord || !request?.destination?.coord) {
    return NextResponse.json({ error: "origin and destination coordinates are required." }, { status: 400 });
  }

  const originGapKm = haversineKm(request.origin.coord, CORRIDOR_ORIGIN_STATION);
  const destGapKm = haversineKm(request.destination.coord, CORRIDOR_DEST_STATION);
  if (originGapKm > MAX_ACCESS_KM || destGapKm > MAX_ACCESS_KM) {
    return NextResponse.json(
      {
        error:
          "This demo only plans the Punggol ↔ one-north corridor (North East Line + Circle Line). Your origin or destination is too far from that corridor's access stations for this bounded demo to route honestly.",
        boundary: { originGapKm: Math.round(originGapKm * 10) / 10, destGapKm: Math.round(destGapKm * 10) / 10, maxKm: MAX_ACCESS_KM },
      },
      { status: 422 }
    );
  }

  const [alerts, nelCrowd, cclCrowd, weatherOrigin, weatherDest, originWalkLeg, originCycleLeg, destWalkLeg] =
    await Promise.all([
      fetchTrainServiceAlerts(scenario),
      fetchCrowdForecast("NEL"),
      fetchCrowdForecast("CCL"),
      fetchWeatherFor("Punggol"),
      fetchWeatherFor("Queenstown"),
      walkLeg(request.origin.coord, CORRIDOR_ORIGIN_STATION, request.origin.label, "Punggol"),
      cycleLeg(request.origin.coord, CORRIDOR_ORIGIN_STATION, request.origin.label, "Punggol"),
      walkLeg(CORRIDOR_DEST_STATION, request.destination.coord, "one-north", request.destination.label),
    ]);

  const crowdByStation = new Map<string, CrowdForecastEntry[]>();
  for (const entry of [...nelCrowd.entries, ...cclCrowd.entries]) {
    const list = crowdByStation.get(entry.station) ?? [];
    list.push(entry);
    crowdByStation.set(entry.station, list);
  }

  if (simulateStale) {
    const staleTime = new Date(Date.now() - 3 * 3600_000).toISOString();
    alerts.provenance.fetchedAt = staleTime;
    alerts.provenance.note = (alerts.provenance.note ? alerts.provenance.note + " " : "") + "Simulated stale cache for demo purposes.";
  }

  const result = planTrip(request, {
    affectedSegments: alerts.affectedSegments,
    crowdByStation,
    weatherOrigin,
    weatherDestination: weatherDest,
    originWalkLeg,
    originCycleLeg,
    destWalkLeg,
    provenance: {
      alerts: alerts.provenance,
      crowdForecast: nelCrowd.provenance.mode === "live" ? nelCrowd.provenance : cclCrowd.provenance,
      weather: weatherOrigin.provenance,
    },
  });

  return NextResponse.json({
    result,
    alerts: { status: alerts.status, messages: alerts.messages, affectedSegments: alerts.affectedSegments, provenance: alerts.provenance },
    weather: { origin: weatherOrigin, destination: weatherDest },
  });
}
