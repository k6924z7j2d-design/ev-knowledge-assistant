import { evVehicles } from "@/lib/ev-data";
import { EvCard } from "./EvCard";

export function EvGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {evVehicles.map((vehicle) => (
        <EvCard key={vehicle.slug} vehicle={vehicle} />
      ))}
    </div>
  );
}
