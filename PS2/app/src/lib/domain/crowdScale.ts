import type { CrowdLevel, RawCrowdLevel } from "./types";

/** Maps LTA's raw l/m/h/NA scale to the app's CrowdLevel. Missing data (NA)
 * maps to "unknown", never to "low" — see PS2_README.md ranking rules. */
export function mapRawCrowd(raw: RawCrowdLevel): CrowdLevel {
  switch (raw) {
    case "l":
      return "low";
    case "m":
      return "moderate";
    case "h":
      return "high";
    default:
      return "unknown";
  }
}

export const CROWD_RANK: Record<CrowdLevel, number> = {
  low: 0,
  moderate: 1,
  unknown: 1.5, // penalised between moderate and high — unknown is not treated as safe
  high: 3,
};
