import type { ReactNode } from "react";
import { BatteryMedium } from "lucide-react";

type EvStatCardProps = {
  label: string;
  value: ReactNode;
  unit?: string;
  variant?: "plain" | "progress" | "battery" | "dark-hero";
  progressPercent?: number;
};

export function EvStatCard({
  label,
  value,
  unit,
  variant = "plain",
  progressPercent = 0,
}: EvStatCardProps) {
  if (variant === "dark-hero") {
    return (
      <div className="bg-chrome-header rounded-2xl p-4">
        <div className="text-[11px] uppercase tracking-wide text-text-on-dark-secondary font-semibold">
          {label}
        </div>
        <div className="text-[32px] font-bold mt-1.5 text-white tracking-tight">
          {value}
          {unit && <span className="text-sm text-success font-bold ml-1">{unit}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-2xl p-4 bg-surface">
      <div className="text-[11px] uppercase tracking-wide text-text-secondary font-semibold">
        {label}
      </div>

      {variant === "battery" ? (
        <div className="flex items-center gap-2.5 mt-3">
          <BatteryMedium width={32} height={20} className="text-text-primary" />
          <span className="text-2xl font-bold">
            {value}
            {unit && <span className="text-xs text-text-secondary font-semibold ml-1">{unit}</span>}
          </span>
        </div>
      ) : (
        <div className="text-[32px] font-bold mt-1.5 tracking-tight">
          {value}
          {unit && <span className="text-sm text-text-secondary font-semibold ml-1">{unit}</span>}
        </div>
      )}

      {variant === "progress" && (
        <div className="h-1.5 bg-bg rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-success rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
