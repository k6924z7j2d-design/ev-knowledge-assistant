import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import type { EvVehicle } from "@/lib/ev-data";
import { CitationChip, CitationRow } from "./CitationChip";

export const EvGarageResult: ToolCallMessagePartComponent = ({ result, status }) => {
  if (status.type === "running") {
    return <div className="text-[10.5px] text-text-secondary animate-pulse">Searching the garage...</div>;
  }

  const vehicles = (result as EvVehicle[] | undefined) ?? [];
  if (vehicles.length === 0) {
    return <div className="text-[10.5px] text-text-secondary">No matching vehicles in the garage.</div>;
  }

  return (
    <CitationRow>
      {vehicles.map((vehicle) => (
        <CitationChip
          key={vehicle.slug}
          tag="Garage"
          label={`${vehicle.name} · ${vehicle.rangeMi}mi`}
          href={`/evs/${vehicle.slug}`}
        />
      ))}
    </CitationRow>
  );
};
