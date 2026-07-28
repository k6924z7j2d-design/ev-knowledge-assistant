export type UsageEntry = {
  timestamp: number;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

const STORAGE_KEY = "ev-usage-log";
const MAX_ENTRIES = 50;
export const USAGE_LOG_UPDATED_EVENT = "ev-usage-log-updated";

export function listUsageEntries(): UsageEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UsageEntry[];
    return Array.isArray(parsed) ? parsed.sort((a, b) => b.timestamp - a.timestamp) : [];
  } catch {
    return [];
  }
}

export function appendUsageEntry(entry: UsageEntry) {
  if (typeof window === "undefined") return;
  const entries = [entry, ...listUsageEntries()].slice(0, MAX_ENTRIES);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event(USAGE_LOG_UPDATED_EVENT));
}
