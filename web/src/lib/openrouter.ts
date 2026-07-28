export const DEFAULT_MODEL = "openai/gpt-oss-20b:free";

export type OpenRouterKeyInfo = {
  label: string;
  limit: number | null;
  limit_remaining: number | null;
  usage: number;
  usage_daily: number;
  usage_weekly: number;
  usage_monthly: number;
  is_free_tier: boolean;
};

export async function getOpenRouterKeyInfo(): Promise<OpenRouterKeyInfo> {
  const res = await fetch("https://openrouter.ai/api/v1/key", {
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`OpenRouter /key request failed: ${res.status}`);
  }
  const { data } = await res.json();
  return data;
}

export type OpenRouterModel = {
  id: string;
  name: string;
  description: string;
  context_length: number;
  pricing: { prompt: string; completion: string };
};

export async function getOpenRouterModels(): Promise<OpenRouterModel[]> {
  const res = await fetch("https://openrouter.ai/api/v1/models", {
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`OpenRouter /models request failed: ${res.status}`);
  }
  const { data } = await res.json();
  return data;
}
