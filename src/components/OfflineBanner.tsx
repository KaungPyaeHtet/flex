export default function OfflineBanner({ cachedAt }: { cachedAt: string | null }) {
  return (
    <div className="rounded-xl border border-warn/40 bg-warn-soft p-3 text-sm text-warn" role="status">
      <strong className="font-semibold">You&apos;re offline.</strong> Showing your last saved journey
      {cachedAt && <> from {new Date(cachedAt).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" })}</>}.
      Conditions haven&apos;t been re-checked since then.
    </div>
  );
}
