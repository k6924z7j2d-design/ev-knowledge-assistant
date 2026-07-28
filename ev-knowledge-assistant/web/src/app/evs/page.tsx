import { EvGrid } from "@/components/evs/EvGrid";
import { evVehicles } from "@/lib/ev-data";

export default function EvsGaragePage() {
  return (
    <div className="max-w-[1390px] mx-auto px-10 py-8 pb-20">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold mb-1">Garage</h1>
        <p className="text-text-secondary text-[15px] m-0">
          {evVehicles.length} vehicles · Fictional spec sheets for demo purposes
        </p>
      </div>
      <EvGrid />
    </div>
  );
}
