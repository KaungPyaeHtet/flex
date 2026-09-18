// Server-side adapter for LTA DataMall's Station Crowd Density endpoints.
//
//   GET /ltaodataservice/PCDForecast?TrainLine=<code>   — 30-min buckets, 24h ahead
//   GET /ltaodataservice/PCDRealTime?TrainLine=<code>   — refreshed every 10 min
//
// Both return { Station, StartTime, EndTime, CrowdLevel } with CrowdLevel in
// {l, m, h, NA}. NA must surface as "unknown", never as "low" — see
// src/lib/domain/crowdScale.ts.
//
// Falls back to the labelled fixture (src/fixtures/crowdForecast.ts) when no
// AccountKey is configured or the live call fails.

import type { CrowdForecastEntry, CrowdForecastResponse, LineCode, RawCrowdLevel } from "../domain/types";
import { buildCrowdForecastFixture } from "../../fixtures/crowdForecast";
import { mapRawCrowd } from "../domain/crowdScale";
import { CANONICAL_LINES } from "../domain/corridor";

function pcdCodeFor(line: LineCode): string | null {
  return CANONICAL_LINES.find((l) => l.canonical === line)?.pcdCode ?? null;
}

interface RawPcdEntry {
  Station: string;
  StartTime: string;
  EndTime: string;
  CrowdLevel: RawCrowdLevel;
}
interface RawPcdResponse {
  value: RawPcdEntry[];
}

function toHHmm(iso: string): string {
  // LTA returns full timestamps for PCDForecast; keep just HH:mm for display/matching.
  const m = iso.match(/T(\d{2}:\d{2})/);
  return m ? m[1] : iso;
}

export async function fetchCrowdForecast(line: LineCode): Promise<CrowdForecastResponse> {
  const key = process.env.LTA_ACCOUNT_KEY;
  const pcdCode = pcdCodeFor(line);
  if (!key || !pcdCode) {
    return {
      line,
      entries: buildCrowdForecastFixture(line),
      provenance: {
        mode: "synthetic",
        source: "PCDForecast (constructed fixture, matches real schema)",
        fetchedAt: new Date().toISOString(),
        note: !key ? "LTA_ACCOUNT_KEY not configured." : undefined,
      },
    };
  }
  try {
    const res = await fetch(
      `https://datamall2.mytransport.sg/ltaodataservice/PCDForecast?TrainLine=${pcdCode}`,
      { headers: { AccountKey: key, Accept: "application/json" }, next: { revalidate: 21600 } } // 24h feed; cache 6h
    );
    if (!res.ok) throw new Error(`PCDForecast HTTP ${res.status}`);
    const raw = (await res.json()) as RawPcdResponse;
    const entries: CrowdForecastEntry[] = raw.value.map((e) => ({
      station: e.Station,
      startTime: toHHmm(e.StartTime),
      endTime: toHHmm(e.EndTime),
      level: mapRawCrowd(e.CrowdLevel),
    }));
    return {
      line,
      entries,
      provenance: { mode: "live", source: "LTA DataMall PCDForecast", fetchedAt: new Date().toISOString() },
    };
  } catch (err) {
    return {
      line,
      entries: buildCrowdForecastFixture(line),
      provenance: {
        mode: "synthetic",
        source: "PCDForecast (constructed fixture, matches real schema)",
        fetchedAt: new Date().toISOString(),
        note: `Live PCDForecast call failed (${(err as Error).message}); showing labelled fixture instead.`,
      },
    };
  }
}
