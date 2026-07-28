"use client";

import { useEffect, useState } from "react";
import { listUsageEntries, USAGE_LOG_UPDATED_EVENT, type UsageEntry } from "@/lib/usage-log";

type ModelTotals = {
  model: string;
  messages: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

function aggregate(entries: UsageEntry[]): ModelTotals[] {
  const byModel = new Map<string, ModelTotals>();
  for (const entry of entries) {
    const totals = byModel.get(entry.model) ?? {
      model: entry.model,
      messages: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
    };
    totals.messages += 1;
    totals.inputTokens += entry.inputTokens;
    totals.outputTokens += entry.outputTokens;
    totals.totalTokens += entry.totalTokens;
    byModel.set(entry.model, totals);
  }
  return [...byModel.values()].sort((a, b) => b.totalTokens - a.totalTokens);
}

export function ModelUsageBreakdown() {
  const [totals, setTotals] = useState<ModelTotals[]>([]);

  useEffect(() => {
    const refresh = () => setTotals(aggregate(listUsageEntries()));
    refresh();
    window.addEventListener(USAGE_LOG_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(USAGE_LOG_UPDATED_EVENT, refresh);
  }, []);

  if (totals.length === 0) return null;

  return (
    <div className="border border-border rounded-2xl p-5 bg-surface mt-4">
      <div className="text-[15px] font-semibold mb-1">Usage by model</div>
      <p className="text-text-secondary text-[13px] mb-4">
        Real token totals per model, aggregated from your conversations in this app.
      </p>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {totals.map((t) => (
          <div key={t.model} className="border border-border rounded-xl p-4">
            <div className="text-sm font-semibold truncate" title={t.model}>
              {t.model}
            </div>
            <div className="text-text-secondary text-[13px] mt-1">
              {t.messages} {t.messages === 1 ? "message" : "messages"}
            </div>
            <div className="text-[22px] font-bold mt-2">{t.totalTokens.toLocaleString()}</div>
            <div className="text-text-tertiary text-[12px]">
              {t.inputTokens.toLocaleString()} in · {t.outputTokens.toLocaleString()} out
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
