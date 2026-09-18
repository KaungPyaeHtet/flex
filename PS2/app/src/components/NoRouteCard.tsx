export default function NoRouteCard({ limitingConstraint }: { limitingConstraint?: string }) {
  return (
    <section className="rounded-2xl border border-danger/40 bg-danger-soft p-4" role="alert">
      <h2 className="font-semibold text-danger">No feasible route in this window</h2>
      <p className="mt-1.5 text-sm text-text">
        {limitingConstraint ?? "None of the candidate departures satisfy your constraints."}
      </p>
      <p className="mt-2 text-xs text-text-muted">
        Try an earlier earliest-departure, a later latest-arrival, a higher walk/cycle tolerance, or enabling
        cycle-and-park.
      </p>
    </section>
  );
}
