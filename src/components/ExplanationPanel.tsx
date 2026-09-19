import type { PlanResult, Provenance } from "@/lib/domain/types";
import { minutesSince } from "@/lib/offline/cache";

function ProvenanceRow({ label, p, staleAfterMin }: { label: string; p: Provenance; staleAfterMin: number }) {
  const ageMin = Math.round(minutesSince(p.fetchedAt));
  const stale = ageMin > staleAfterMin;
  const modeLabel = p.mode === "live" ? "Live" : p.mode === "replay" ? "Replay" : "Synthetic / fixture";
  return (
    <div className="flex flex-col gap-0.5 border-b border-border py-2 text-xs last:border-0">
      <div className="flex items-center justify-between">
        <span className="font-semibold">{label}</span>
        <span
          className={`rounded-full px-2 py-0.5 font-medium ${
            p.mode === "live" ? "bg-accent-soft text-accent" : "bg-black/5 text-text-muted"
          }`}
        >
          {modeLabel}
        </span>
      </div>
      <div className="text-text-muted">
        Source: {p.source} · as of {new Date(p.fetchedAt).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" })} (
        {ageMin} min ago){stale && <span className="ml-1 font-semibold text-danger">· STALE</span>}
      </div>
      {p.note && <div className="text-text-muted italic">{p.note}</div>}
    </div>
  );
}

export default function ExplanationPanel({ result, messages }: { result: PlanResult; messages: { content: string; createdDate: string }[] }) {
  return (
    <details className="mt-4 rounded-2xl border border-border bg-surface p-4 text-sm">
      <summary className="cursor-pointer font-semibold">Why this recommendation, and where the data comes from</summary>

      <div className="mt-3">
        <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-text-muted">Data sources this trip used</h3>
        <ProvenanceRow label="Train service alerts" p={result.conditionsProvenance.alerts} staleAfterMin={30} />
        <ProvenanceRow label="Station crowd forecast" p={result.conditionsProvenance.crowdForecast} staleAfterMin={360} />
        <ProvenanceRow label="Weather" p={result.conditionsProvenance.weather} staleAfterMin={45} />
      </div>

      {messages.length > 0 && (
        <div className="mt-3">
          <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-text-muted">Official service notices</h3>
          {messages.map((m, i) => (
            <p key={i} className="mb-1.5 rounded-lg bg-bg p-2 text-xs text-text-muted">
              {m.content}
            </p>
          ))}
        </div>
      )}

      <div className="mt-3">
        <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-text-muted">Modelling assumptions (disclosed, not hidden)</h3>
        <ul className="list-disc pl-4 text-xs text-text-muted marker:text-accent">
          <li>Walking and cycling legs are real routed times/geometry from OSM data (OSRM), not straight lines.</li>
          <li>Inter-station rail running time is assumed at ~2.3 min/segment (typical scheduled run + dwell), not a live GTFS feed &mdash; shown as a range, not a single number.</li>
          <li>A disruption with an active shuttle/free-bus mitigation adds an assumed +15 min, not a modelled recovery time.</li>
          <li>Crowd levels are shown at the documented 30-minute forecast resolution &mdash; never invented per-minute.</li>
          <li>Missing crowd data is shown as &ldquo;unknown&rdquo;, never treated as low.</li>
        </ul>
      </div>

      <div className="mt-3">
        <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-text-muted">Known limits</h3>
        <ul className="list-disc pl-4 text-xs text-text-muted marker:text-accent">
          <li>Bounded corridor demo: only Punggol ↔ one-north via the North East Line and Circle Line is modelled.</li>
          <li>LTA DataMall (train alerts, crowd) runs on labelled fixtures unless an AccountKey is configured &mdash; see README.</li>
          <li>Rail geometry on the map is schematic (station-to-station through real station coordinates), not a live train GPS trace.</li>
        </ul>
      </div>

      <p className="mt-3 text-[11px] text-text-muted">© OpenStreetMap contributors.</p>
    </details>
  );
}
