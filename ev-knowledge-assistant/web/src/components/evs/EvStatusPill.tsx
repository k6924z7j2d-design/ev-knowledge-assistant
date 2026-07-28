import type { EvStatusPillData } from "@/lib/ev-data";

export function EvStatusPill({ label, tone }: EvStatusPillData) {
  const className =
    tone === "success"
      ? "bg-success-tint text-success"
      : "bg-warning text-white";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[13px] font-semibold rounded-full px-3.5 py-1.5 ${className}`}
    >
      {tone === "success" ? "▲" : "▼"} {label}
    </span>
  );
}
