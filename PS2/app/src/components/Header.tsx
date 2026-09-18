export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between">
        <div>
          <h1 className="text-lg font-bold leading-none">Flex</h1>
          <p className="text-xs text-text-muted">Leave now, leave later, or take another route.</p>
        </div>
        <span className="rounded-full bg-bg px-2.5 py-1 text-[11px] font-semibold text-text-muted">Punggol → one-north</span>
      </div>
    </header>
  );
}
