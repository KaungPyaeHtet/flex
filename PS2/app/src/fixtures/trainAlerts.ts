// Labelled fixtures standing in for LTA DataMall's TrainServiceAlerts
// endpoint. The live adapter (src/lib/data/trainAlerts.ts) calls the real
// endpoint when an AccountKey is configured; these fixtures are the
// fallback, and are always surfaced with `mode: "synthetic"` — never
// presented as freshly fetched.
//
// Per PS2_README.md 2.6: "AffectedSegments is empty on a normal day... you
// may demonstrate the major-disruption path by replay or injected test data
// provided it is labelled as such." That is exactly what these are: the
// "disruption" and "planned-works" scenarios are constructed, matching the
// endpoint's real shape (Status, AffectedSegments nested list, Message
// list, FreePublicBus/FreeMRTShuttle mitigation fields) documented in
// PS2/references/LTA_DataMall_API_User_Guide.pdf. The "normal" and
// "irrelevant" scenarios reflect what the feed looks like on an ordinary
// day / during an incident on an unrelated line.

import type { TrainServiceAlertsResponse } from "../lib/domain/types";

export type ScenarioId = "normal" | "planned-works" | "disruption" | "irrelevant-disruption";

const base = (): Omit<TrainServiceAlertsResponse, "affectedSegments" | "messages"> => ({
  status: 1,
  provenance: {
    mode: "synthetic",
    source: "TrainServiceAlerts (constructed fixture, matches real schema)",
    fetchedAt: new Date().toISOString(),
  },
});

export function buildTrainAlertsFixture(scenario: ScenarioId): TrainServiceAlertsResponse {
  switch (scenario) {
    case "normal":
      return {
        ...base(),
        status: 1,
        affectedSegments: [],
        messages: [],
      };

    case "planned-works":
      return {
        ...base(),
        status: 1,
        affectedSegments: [],
        messages: [
          {
            content:
              "Advance notice: from Sat 26 Sep 2026 2330hrs to last train, direct Circle Line train service between HarbourFront and one-north will not be available due to planned maintenance works. Free bus service will be provided between the affected stations. Normal service resumes the next day.",
            createdDate: "2026-09-15T10:00:00+08:00",
          },
        ],
      };

    case "disruption":
      return {
        ...base(),
        status: 2,
        affectedSegments: [
          {
            line: "CCL",
            direction: "Both",
            stations: ["CC29", "CC28", "CC27", "CC26", "CC25", "CC24"],
            freePublicBus: "HarbourFront, Telok Blangah, Labrador Park, Pasir Panjang, Haw Par Villa, Kent Ridge",
            freeMrtShuttle: "HarbourFront <> Kent Ridge",
            mrtShuttleDirection: "Both",
          },
        ],
        messages: [
          {
            content:
              "Circle Line: Train service between HarbourFront and Kent Ridge is temporarily unavailable due to a signalling fault. Free MRT shuttle and free regular bus boarding are available at the affected stations. Additional travel time of approximately 20 minutes.",
            createdDate: new Date().toISOString(),
          },
        ],
      };

    case "irrelevant-disruption":
      return {
        ...base(),
        status: 2,
        affectedSegments: [
          {
            line: "NSL",
            direction: "(towards Jurong East)",
            stations: ["NS10", "NS11"], // Admiralty–Woodlands, nowhere near this corridor
          },
        ],
        messages: [
          {
            content:
              "North South Line: Train service between Admiralty and Woodlands is temporarily unavailable due to a track fault. Free regular bus boarding is available at the affected stations.",
            createdDate: new Date().toISOString(),
          },
        ],
      };
  }
}
