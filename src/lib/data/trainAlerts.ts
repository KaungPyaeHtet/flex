// Server-side adapter for LTA DataMall's TrainServiceAlerts.
//
// GET https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts
// Header: AccountKey: <key>
//
// Response shape per PS2_README.md 2.4 / LTA_DataMall_API_User_Guide.pdf:
//   { Status: 1|2, AffectedSegments: [...], Message: [...] }
// AffectedSegments and Message are BOTH lists, and AffectedSegments detail
// (Line, Direction, Stations, FreePublicBus, FreeMRTShuttle,
// MRTShuttleDirection) is nested one level in, not flat on the response.
//
// This module never fabricates a live fetch: if LTA_ACCOUNT_KEY is unset or
// the call fails, it returns the labelled synthetic fixture untouched, with
// the failure reason attached so the caller can surface it honestly.

import type { AffectedSegment, TrainServiceAlertsResponse } from "../domain/types";
import { buildTrainAlertsFixture, type ScenarioId } from "../../fixtures/trainAlerts";

const ENDPOINT = "https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts";

interface RawAffectedSegment {
  Line: string;
  Direction: string;
  Stations: string;
  FreePublicBus?: string;
  FreeMRTShuttle?: string;
  MRTShuttleDirection?: string;
}
interface RawMessage {
  Content: string;
  CreatedDate: string;
}
interface RawResponse {
  Value: {
    Status: 1 | 2;
    AffectedSegments: RawAffectedSegment[];
    Message: RawMessage[];
  };
}

function parseSegment(raw: RawAffectedSegment): AffectedSegment {
  return {
    line: raw.Line,
    direction: raw.Direction,
    stations: raw.Stations.split(",").map((s) => s.trim()).filter(Boolean),
    freePublicBus: raw.FreePublicBus,
    freeMrtShuttle: raw.FreeMRTShuttle,
    mrtShuttleDirection: raw.MRTShuttleDirection,
  };
}

export async function fetchTrainServiceAlerts(
  fallbackScenario: ScenarioId
): Promise<TrainServiceAlertsResponse> {
  const key = process.env.LTA_ACCOUNT_KEY;
  if (!key) {
    return buildTrainAlertsFixture(fallbackScenario);
  }
  try {
    const res = await fetch(ENDPOINT, {
      headers: { AccountKey: key, Accept: "application/json" },
      // TrainServiceAlerts changes ad hoc; do not cache at the fetch layer.
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`TrainServiceAlerts HTTP ${res.status}`);
    const raw = (await res.json()) as RawResponse;
    return {
      status: raw.Value.Status,
      affectedSegments: (raw.Value.AffectedSegments ?? []).map(parseSegment),
      messages: (raw.Value.Message ?? []).map((m) => ({ content: m.Content, createdDate: m.CreatedDate })),
      provenance: {
        mode: "live",
        source: "LTA DataMall TrainServiceAlerts",
        fetchedAt: new Date().toISOString(),
      },
    };
  } catch (err) {
    const fixture = buildTrainAlertsFixture(fallbackScenario);
    return {
      ...fixture,
      provenance: {
        ...fixture.provenance,
        note: `Live TrainServiceAlerts call failed (${(err as Error).message}); showing labelled fixture instead.`,
      },
    };
  }
}
