const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

export function EvEnergyChart({
  values,
  avgKWh,
}: {
  values: number[];
  avgKWh: number;
}) {
  const max = Math.max(...values, 1);
  const peakIndex = values.indexOf(Math.max(...values));

  return (
    <div className="border border-border rounded-2xl p-5 bg-surface">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wide text-text-secondary font-semibold">
          Energy use · last 7 days
        </div>
        <div className="text-sm font-bold text-success">{avgKWh} kWh avg</div>
      </div>
      <div className="flex items-end gap-3 h-[74px] mt-4">
        {values.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className={`w-full rounded-t-md ${i === peakIndex ? "bg-success" : "bg-success-tint"}`}
              style={{ height: `${(v / max) * 100}%` }}
            />
            <span className="text-[10px] text-text-tertiary font-semibold">
              {dayLabels[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
