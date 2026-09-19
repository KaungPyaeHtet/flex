// Official rules for bringing bicycles onto MRT/LRT trains and buses.
//
// Source: LTA's "Bring Your Foldable Bicycles and Personal Mobility Devices
// on Board Public Transport All Day" notice, as republished by Tower
// Transit Singapore (towertransit.sg/announcements/...). Verified during
// development (September 2026) rather than assumed. See WRITEUP.md.
//
// Rules as stated:
//  - Foldable bicycles/PMDs must not exceed 120cm x 70cm x 40cm WHEN FOLDED.
//  - They must be folded at all times in stations, interchanges and on board
//    — no time-of-day restriction (all-day, not just off-peak).
//  - "Most non-foldable bicycles... do not comply with the allowable
//    dimensions. They will not be allowed on board trains and buses."
//
// This module never assumes an ordinary bicycle can be carried aboard: a
// standard adult bicycle's folded (i.e. unfolded, since it doesn't fold)
// footprint routinely exceeds 120cm x 70cm x 40cm, so it is treated as NOT
// eligible for carriage by default. Only a bicycle explicitly declared as a
// folding bike within the size limit is eligible.

export interface BikeCarriageAssessment {
  eligible: boolean;
  reason: string;
  citation: string;
}

export function assessBikeCarriage(params: {
  isFoldingBike: boolean;
  withinFoldedSizeLimit: boolean;
}): BikeCarriageAssessment {
  const citation =
    "LTA / Tower Transit: foldable bicycles ≤120×70×40cm folded are allowed on trains and buses all day if kept folded; most non-foldable bicycles exceed the limit and are not allowed aboard.";

  if (params.isFoldingBike && params.withinFoldedSizeLimit) {
    return {
      eligible: true,
      reason: "Folding bike within the 120×70×40cm folded limit — allowed on board, kept folded, all day.",
      citation,
    };
  }
  if (params.isFoldingBike && !params.withinFoldedSizeLimit) {
    return {
      eligible: false,
      reason: "Folding bike exceeds the 120×70×40cm folded-size limit — not eligible to carry aboard.",
      citation,
    };
  }
  return {
    eligible: false,
    reason:
      "Standard (non-folding) bicycles are not carried aboard trains or buses — they do not fold to the allowable size. Cycle-and-park at the station instead.",
    citation,
  };
}
