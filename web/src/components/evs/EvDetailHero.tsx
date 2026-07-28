import type { EvVehicle } from "@/lib/ev-data";
import { EvStatusPill } from "./EvStatusPill";

export function EvDetailHero({ vehicle }: { vehicle: EvVehicle }) {
  return (
    <div className="flex gap-6 items-center">
      <div
        className="w-[300px] h-[172px] rounded-2xl flex items-center justify-center shrink-0 text-text-tertiary text-xs font-mono"
        style={{
          background:
            "repeating-linear-gradient(45deg, var(--color-grid), var(--color-grid) 9px, var(--color-bg) 9px, var(--color-bg) 18px)",
        }}
      >
        [ vehicle image ]
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[34px] font-bold tracking-tight leading-none">{vehicle.name}</div>
        <div className="text-text-secondary text-[16px] mt-1.5 font-semibold">
          ${vehicle.price.toLocaleString()} · {vehicle.year} · {vehicle.batteryKWh} kWh
        </div>
        <div className="flex gap-2.5 mt-4 flex-wrap">
          {vehicle.statusPills.map((pill) => (
            <EvStatusPill key={pill.label} {...pill} />
          ))}
        </div>
      </div>
    </div>
  );
}
