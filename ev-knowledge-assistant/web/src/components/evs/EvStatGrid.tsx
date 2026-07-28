import type { EvVehicle } from "@/lib/ev-data";
import { EvStatCard } from "./EvStatCard";

export function EvStatGrid({ vehicle }: { vehicle: EvVehicle }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <EvStatCard
        label="Range"
        value={vehicle.rangeMi}
        unit="mi"
        variant="progress"
        progressPercent={vehicle.rangePercent}
      />
      <EvStatCard
        label="Battery"
        value={vehicle.batteryKWh}
        unit="kWh"
        variant="battery"
      />
      <EvStatCard
        label="Efficiency"
        value={vehicle.efficiencyMiPerKWh}
        unit="mi/kWh"
      />
      <EvStatCard
        label="Charging cost / mo"
        value={`$${vehicle.chargingCostPerMonth}`}
      />
      <EvStatCard
        label="Charge 10→80%"
        value={vehicle.chargeTime10to80Min}
        unit="min"
      />
      <EvStatCard
        label="Reliability"
        value={vehicle.reliabilityScore}
        unit="/10"
        variant="dark-hero"
      />
    </div>
  );
}
