"use client";

import type { ScenarioId } from "@/fixtures/trainAlerts";

const SCENARIOS: { id: ScenarioId; label: string; hint: string }[] = [
  { id: "normal", label: "Normal day", hint: "No disruption. Ordinary AM peak crowd forecast." },
  { id: "planned-works", label: "Planned works", hint: "Advance notice of a weekend maintenance closure." },
  { id: "disruption", label: "Unplanned disruption", hint: "CCL HarbourFront–Kent Ridge down, shuttle + free bus active." },
  { id: "irrelevant-disruption", label: "Irrelevant disruption", hint: "NSL incident, nowhere near this corridor — should NOT change the plan." },
];

export default function ScenarioPicker({
  scenario,
  onScenario,
  simulateStale,
  onStale,
  onSendTestPush,
  pushStatus,
}: {
  scenario: ScenarioId;
  onScenario: (s: ScenarioId) => void;
  simulateStale: boolean;
  onStale: (v: boolean) => void;
  onSendTestPush: () => void;
  pushStatus: string | null;
}) {
  return (
    <section className="rounded-2xl border-2 border-dashed border-warn/60 bg-warn-soft/40 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full bg-warn px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          Demo controls
        </span>
        <span className="text-xs text-text-muted">Not part of the commuter experience &mdash; for judging/testing only</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => onScenario(s.id)}
            className={`rounded-lg border p-2 text-left text-xs ${
              scenario === s.id ? "border-warn bg-white font-semibold" : "border-border bg-white/60"
            }`}
            title={s.hint}
          >
            {s.label}
          </button>
        ))}
      </div>

      <label className="mt-3 flex items-center gap-2.5 text-xs">
        <input type="checkbox" checked={simulateStale} onChange={(e) => onStale(e.target.checked)} className="h-4 w-4" />
        Simulate a 3-hour-old cached feed (tests the stale-data warning)
      </label>

      <div className="mt-3 flex items-center gap-2">
        <button onClick={onSendTestPush} className="rounded-lg border border-warn bg-white px-3 py-2 text-xs font-semibold text-warn">
          Send test push (labelled [DEMO])
        </button>
        {pushStatus && <span className="text-xs text-text-muted">{pushStatus}</span>}
      </div>
    </section>
  );
}
