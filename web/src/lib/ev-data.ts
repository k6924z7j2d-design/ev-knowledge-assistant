export type EvStatusPillData = {
  label: string;
  tone: "success" | "warning";
};

export type EvVehicle = {
  slug: string;
  name: string;
  trim: string;
  year: number;
  price: number;
  batteryKWh: number;
  rangeMi: number;
  rangePercent: number;
  efficiencyMiPerKWh: number;
  chargingCostPerMonth: number;
  chargeTime10to80Min: number;
  reliabilityScore: number;
  weeklyEnergyUseKWh: number[];
  weeklyEnergyAvgKWh: number;
  statusPills: EvStatusPillData[];
};

export const evVehicles: EvVehicle[] = [
  {
    slug: "voltra",
    name: "Voltra Aurora GT",
    trim: "Long Range · Dual Motor AWD",
    year: 2026,
    price: 52990,
    batteryKWh: 91,
    rangeMi: 340,
    rangePercent: 92,
    efficiencyMiPerKWh: 3.7,
    chargingCostPerMonth: 46,
    chargeTime10to80Min: 18,
    reliabilityScore: 9.1,
    weeklyEnergyUseKWh: [40, 54, 36, 66, 48, 29, 23],
    weeklyEnergyAvgKWh: 42,
    statusPills: [{ label: "Shortlisted", tone: "success" }],
  },
  {
    slug: "solis",
    name: "Solis Meridian",
    trim: "Standard Range · RWD",
    year: 2026,
    price: 38400,
    batteryKWh: 68,
    rangeMi: 290,
    rangePercent: 78,
    efficiencyMiPerKWh: 4.3,
    chargingCostPerMonth: 38,
    chargeTime10to80Min: 26,
    reliabilityScore: 8.6,
    weeklyEnergyUseKWh: [31, 41, 27, 50, 36, 22, 18],
    weeklyEnergyAvgKWh: 32,
    statusPills: [
      { label: "Shortlisted", tone: "success" },
      { label: "Price dropped $1,200", tone: "warning" },
    ],
  },
  {
    slug: "kestrel",
    name: "Kestrel Ranger EV",
    trim: "Extended Range · Dual Motor AWD",
    year: 2026,
    price: 64900,
    batteryKWh: 131,
    rangeMi: 310,
    rangePercent: 84,
    efficiencyMiPerKWh: 2.4,
    chargingCostPerMonth: 61,
    chargeTime10to80Min: 32,
    reliabilityScore: 8.3,
    weeklyEnergyUseKWh: [58, 74, 49, 91, 66, 40, 32],
    weeklyEnergyAvgKWh: 59,
    statusPills: [],
  },
  {
    slug: "nimbus",
    name: "Nimbus Coupe SE",
    trim: "Performance · RWD",
    year: 2026,
    price: 61750,
    batteryKWh: 82,
    rangeMi: 265,
    rangePercent: 72,
    efficiencyMiPerKWh: 3.2,
    chargingCostPerMonth: 52,
    chargeTime10to80Min: 15,
    reliabilityScore: 8.8,
    weeklyEnergyUseKWh: [45, 60, 40, 74, 53, 32, 26],
    weeklyEnergyAvgKWh: 47,
    statusPills: [{ label: "Shortlisted", tone: "success" }],
  },
];

export function getEvBySlug(slug: string): EvVehicle | undefined {
  return evVehicles.find((v) => v.slug === slug);
}
