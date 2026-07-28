import Link from "next/link";
import type { EvVehicle } from "@/lib/ev-data";
import { ArrowRight } from "lucide-react";

export function EvCard({ vehicle }: { vehicle: EvVehicle }) {
  return (
    <Link
      href={`/evs/${vehicle.slug}`}
      className="border border-border rounded-2xl p-6 bg-surface block hover:border-accent transition-colors"
    >
      <div className="text-xl font-semibold tracking-tight">{vehicle.name}</div>
      <div className="text-text-secondary text-[13px] mt-0.5">{vehicle.trim}</div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-[16px] font-semibold">
          ${vehicle.price.toLocaleString()}
        </span>
        <span className="text-text-tertiary text-sm flex items-center gap-1">
          specs <ArrowRight width={13} height={13} />
        </span>
      </div>
    </Link>
  );
}
