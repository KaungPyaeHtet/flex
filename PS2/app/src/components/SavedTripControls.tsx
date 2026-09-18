"use client";

export default function SavedTripControls({
  isSaved,
  onSave,
  onClear,
  lastReevaluatedAt,
  changedNotice,
}: {
  isSaved: boolean;
  onSave: () => void;
  onClear: () => void;
  lastReevaluatedAt: string | null;
  changedNotice: string | null;
}) {
  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Save this trip</span>
        {isSaved ? (
          <button onClick={onClear} className="text-xs font-medium text-danger">
            Remove
          </button>
        ) : (
          <button onClick={onSave} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-contrast">
            Save
          </button>
        )}
      </div>
      {isSaved && (
        <p className="text-xs text-text-muted">
          While this tab is open, Flex re-checks conditions every couple of minutes and flags anything that changes your
          recommendation.
          {lastReevaluatedAt && (
            <> Last checked {new Date(lastReevaluatedAt).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" })}.</>
          )}
        </p>
      )}
      {changedNotice && (
        <div className="rounded-lg bg-warn-soft p-2 text-xs font-medium text-warn" role="status">
          {changedNotice}
        </div>
      )}
    </section>
  );
}
