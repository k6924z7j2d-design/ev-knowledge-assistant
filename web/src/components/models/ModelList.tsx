"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { OpenRouterModel } from "@/lib/openrouter";
import { getSelectedModel, setSelectedModel } from "@/lib/chat-settings";

function formatPrice(perTokenUsd: string) {
  const perMillion = Number(perTokenUsd) * 1_000_000;
  if (perMillion === 0) return "Free";
  return `$${perMillion.toFixed(2)} / 1M`;
}

export function ModelList({
  models,
  defaultModel,
}: {
  models: OpenRouterModel[];
  defaultModel: string;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setSelected(getSelectedModel());
  }, []);

  function choose(id: string | undefined) {
    setSelectedModel(id);
    setSelected(id);
  }

  const effectiveModel = selected ?? defaultModel;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return models;
    return models.filter(
      (m) => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q),
    );
  }, [models, query]);

  return (
    <div>
      <div className="flex items-center justify-between border border-border rounded-lg px-3.5 py-2.5 mb-4">
        <div className="text-sm">
          <span className="text-text-secondary">Default chat model: </span>
          <span className="font-semibold">{effectiveModel}</span>
        </div>
        {selected && (
          <button
            type="button"
            onClick={() => choose(undefined)}
            className="text-info text-[13px] font-semibold"
          >
            Reset to default
          </button>
        )}
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search models..."
        className="w-full max-w-sm border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-info mb-4"
      />
      <p className="text-text-secondary text-[13px] mb-3">
        {filtered.length.toLocaleString()} of {models.length.toLocaleString()} models
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-bg text-text-secondary">
              <th className="text-left font-semibold py-2.5 px-2">Model</th>
              <th className="text-right font-semibold py-2.5 px-2">Context</th>
              <th className="text-right font-semibold py-2.5 px-2">Prompt price</th>
              <th className="text-right font-semibold py-2.5 px-2">Completion price</th>
              <th className="text-right font-semibold py-2.5 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((model) => (
              <tr key={model.id} className="border-t border-border">
                <td className="py-2.5 px-2">
                  <div className="font-medium">{model.name}</div>
                  <div className="text-text-tertiary text-[12px]">{model.id}</div>
                </td>
                <td className="py-2.5 px-2 text-right">{model.context_length.toLocaleString()}</td>
                <td className="py-2.5 px-2 text-right">{formatPrice(model.pricing.prompt)}</td>
                <td className="py-2.5 px-2 text-right">{formatPrice(model.pricing.completion)}</td>
                <td className="py-2.5 px-2 text-right">
                  {effectiveModel === model.id ? (
                    <span className="text-success text-[12px] font-semibold">Default</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => choose(model.id)}
                      className="text-info text-[12px] font-semibold"
                    >
                      Set as default
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
