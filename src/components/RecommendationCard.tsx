import type { CandidateEvaluation } from "@/lib/domain/types";
import CrowdBadge from "./CrowdBadge";
import { routeLabel, ACCESS_MODE_LABEL, formatDuration } from "@/lib/domain/labels";

export default function RecommendationCard({
  candidate,
  explanation,
}: {
  candidate: CandidateEvaluation;
  explanation: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm" aria-label="Recommended departure">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-contrast">
          Recommended
        </span>
        <CrowdBadge level={candidate.worstCrowd} compact />
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums">{candidate.departureClock}</span>
        <span className="text-text-muted">depart</span>
      </div>
      <div className="mt-1 text-sm text-text-muted">
        Arrive {candidate.arrivalRange[0]}–{candidate.arrivalRange[1]} · {routeLabel(candidate.routeOptionId)} ·{" "}
        {ACCESS_MODE_LABEL[candidate.accessMode]}
      </div>

      <p className="mt-3 text-[15px] leading-snug text-text">{explanation}</p>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-bg p-2">
          <dt className="text-text-muted">Duration</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{formatDuration(candidate.totalDurationRange)}</dd>
        </div>
        <div className="rounded-lg bg-bg p-2">
          <dt className="text-text-muted">Transfers</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{candidate.transfers}</dd>
        </div>
        <div className="rounded-lg bg-bg p-2">
          <dt className="text-text-muted">Walk/cycle</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">
            {Math.round(candidate.walkingExposureMinutes + candidate.cyclingMinutes)} min
          </dd>
        </div>
      </dl>

      {candidate.mitigations.length > 0 && (
        <div className="mt-3 rounded-lg bg-warn-soft p-2.5 text-xs text-warn">
          <strong className="font-semibold">Mitigation active:</strong> {candidate.mitigations.join(" · ")}
        </div>
      )}
      {candidate.weatherFlag && (
        <div className="mt-2 rounded-lg bg-bg p-2.5 text-xs text-text-muted">☔ {candidate.weatherFlag}</div>
      )}
    </section>
  );
}
