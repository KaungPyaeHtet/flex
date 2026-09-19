import { describe, it, expect } from "vitest";
import { mapRawCrowd, CROWD_RANK } from "@/lib/domain/crowdScale";

describe("crowd scale", () => {
  it("maps missing data (NA) to unknown, never to low", () => {
    expect(mapRawCrowd("NA")).toBe("unknown");
    expect(mapRawCrowd("NA")).not.toBe("low");
  });

  it("ranks unknown worse than moderate so it is never silently treated as safe", () => {
    expect(CROWD_RANK.unknown).toBeGreaterThan(CROWD_RANK.moderate);
  });

  it("maps l/m/h to low/moderate/high", () => {
    expect(mapRawCrowd("l")).toBe("low");
    expect(mapRawCrowd("m")).toBe("moderate");
    expect(mapRawCrowd("h")).toBe("high");
  });
});
