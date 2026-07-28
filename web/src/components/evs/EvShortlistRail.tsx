import Link from "next/link";
import { evVehicles } from "@/lib/ev-data";

export function EvShortlistRail({ activeSlug }: { activeSlug: string }) {
  return (
    <div className="w-[150px] shrink-0 bg-chrome-sidebar py-5 px-3.5 flex flex-col gap-3">
      <div className="text-[11px] uppercase tracking-wide text-text-on-dark-secondary font-semibold px-1">
        Shortlist
      </div>
      {evVehicles.map((vehicle) => {
        const active = vehicle.slug === activeSlug;
        return (
          <Link
            key={vehicle.slug}
            href={`/evs/${vehicle.slug}`}
            className={[
              "rounded-2xl p-2.5 flex flex-col items-center gap-1.5 text-center",
              active ? "bg-info-tint border-[1.5px] border-info" : "border border-white/15",
            ].join(" ")}
          >
            <div
              className="w-full h-11 rounded-lg"
              style={{
                background:
                  "repeating-linear-gradient(45deg, var(--color-grid), var(--color-grid) 7px, var(--color-surface) 7px, var(--color-surface) 14px)",
              }}
            />
            <span
              className={[
                "text-xs",
                active ? "font-bold text-text-primary" : "font-semibold text-text-on-dark-secondary",
              ].join(" ")}
            >
              {vehicle.name.split(" ")[0]} {vehicle.name.split(" ")[1] ?? ""}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
