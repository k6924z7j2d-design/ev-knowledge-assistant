"use client";

import { useEffect, useState } from "react";
import { listUsageEntries, USAGE_LOG_UPDATED_EVENT, type UsageEntry } from "@/lib/usage-log";

export function ChatUsageLog() {
  const [entries, setEntries] = useState<UsageEntry[]>([]);

  useEffect(() => {
    const refresh = () => setEntries(listUsageEntries());
    refresh();
    window.addEventListener(USAGE_LOG_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(USAGE_LOG_UPDATED_EVENT, refresh);
  }, []);

  return (
    <div className="border border-border rounded-2xl p-5 bg-surface mt-4">
      <div className="text-[15px] font-semibold mb-1">Chat usage</div>
      <p className="text-text-secondary text-[13px] mb-4">
        Real token usage from your conversations with the assistant in this app.
      </p>

      {entries.length === 0 ? (
        <div className="text-text-secondary text-sm py-6 text-center">
          No chat activity yet — send a message to see real usage appear here.
        </div>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-bg text-text-secondary">
              <th className="text-left font-semibold py-2.5 px-2">Time</th>
              <th className="text-left font-semibold py-2.5 px-2">Model</th>
              <th className="text-right font-semibold py-2.5 px-2">Input</th>
              <th className="text-right font-semibold py-2.5 px-2">Output</th>
              <th className="text-right font-semibold py-2.5 px-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.timestamp} className="border-t border-border">
                <td className="py-2.5 px-2 text-text-secondary">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </td>
                <td className="py-2.5 px-2">{entry.model}</td>
                <td className="py-2.5 px-2 text-right">{entry.inputTokens}</td>
                <td className="py-2.5 px-2 text-right">{entry.outputTokens}</td>
                <td className="py-2.5 px-2 text-right font-semibold">{entry.totalTokens}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
