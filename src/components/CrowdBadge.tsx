import type { CrowdLevel } from "@/lib/domain/types";

const STYLES: Record<CrowdLevel, { bg: string; fg: string; label: string; icon: string }> = {
  low: { bg: "bg-accent-soft", fg: "text-accent", label: "Low crowd", icon: "●" },
  moderate: { bg: "bg-warn-soft", fg: "text-warn", label: "Moderate crowd", icon: "●●" },
  high: { bg: "bg-danger-soft", fg: "text-danger", label: "High crowd", icon: "●●●" },
  unknown: { bg: "bg-black/5", fg: "text-text-muted", label: "Crowd unknown", icon: "?" },
};

export default function CrowdBadge({ level, compact = false }: { level: CrowdLevel; compact?: boolean }) {
  const s = STYLES[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.bg} ${s.fg}`}
      aria-label={s.label}
    >
      <span aria-hidden className="tabular-nums tracking-tighter">
        {s.icon}
      </span>
      {!compact && <span>{s.label}</span>}
    </span>
  );
}
