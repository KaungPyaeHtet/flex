import type { CandidateEvaluation } from "@/lib/domain/types";
import CrowdBadge from "./CrowdBadge";
import { routeLabel, formatDuration } from "@/lib/domain/labels";

export default function DepartureComparison({
  recommended,
  alternatives,
  selectedId,
  onSelect,
}: {
  recommended: CandidateEvaluation;
  alternatives: CandidateEvaluation[];
  selectedId: string;
  onSelect: (c: CandidateEvaluation) => void;
}) {
  const options = [recommended, ...alternatives];

  return (
    <section aria-label="Compare departure options" className="mt-4">
      <h2 className="mb-2 text-sm font-semibold text-text-muted">Compare your options</h2>
      <div className="flex flex-col gap-2">
        {options.map((c, i) => {
          const selected = c.id === selectedId;
          const tag = i === 0 ? "Recommended" : c.routeOptionId !== recommended.routeOptionId ? "Another route" : "Alternative time";
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors ${
                selected ? "border-accent bg-accent-soft" : "border-border bg-surface"
              }`}
              aria-pressed={selected}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tabular-nums">{c.departureClock}</span>
                  <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-medium text-text-muted">{tag}</span>
                </div>
                <div className="mt-0.5 text-xs text-text-muted">
                  {routeLabel(c.routeOptionId)} · arrive {c.arrivalRange[0]}–{c.arrivalRange[1]} · {formatDuration(c.totalDurationRange)}
                </div>
              </div>
              <CrowdBadge level={c.worstCrowd} compact />
            </button>
          );
        })}
      </div>
    </section>
  );
}
