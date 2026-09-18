import { describe, it, expect } from "vitest";
import { assessBikeCarriage } from "@/lib/domain/bikeRules";

describe("bike carriage rules", () => {
  it("rejects an ordinary (non-folding) bicycle by default", () => {
    const result = assessBikeCarriage({ isFoldingBike: false, withinFoldedSizeLimit: false });
    expect(result.eligible).toBe(false);
    expect(result.reason).toMatch(/not carried aboard/i);
  });

  it("accepts a folding bike within the official 120x70x40cm folded limit", () => {
    const result = assessBikeCarriage({ isFoldingBike: true, withinFoldedSizeLimit: true });
    expect(result.eligible).toBe(true);
  });

  it("rejects a folding bike that exceeds the folded-size limit", () => {
    const result = assessBikeCarriage({ isFoldingBike: true, withinFoldedSizeLimit: false });
    expect(result.eligible).toBe(false);
    expect(result.reason).toMatch(/exceeds/i);
  });

  it("never marks an ordinary bicycle eligible even if it happens to be small", () => {
    // withinFoldedSizeLimit is meaningless for a bike that doesn't fold; isFoldingBike must be the gate.
    const result = assessBikeCarriage({ isFoldingBike: false, withinFoldedSizeLimit: true });
    expect(result.eligible).toBe(false);
  });
});
