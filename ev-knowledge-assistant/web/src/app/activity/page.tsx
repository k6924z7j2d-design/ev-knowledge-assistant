import { AccountSummary } from "@/components/activity/AccountSummary";
import { ModelUsageBreakdown } from "@/components/activity/ModelUsageBreakdown";
import { ChatUsageLog } from "@/components/activity/ChatUsageLog";
import { getOpenRouterKeyInfo, type OpenRouterKeyInfo } from "@/lib/openrouter";

async function loadAccountData(): Promise<
  { data: OpenRouterKeyInfo; error?: undefined } | { data?: undefined; error: string }
> {
  try {
    return { data: await getOpenRouterKeyInfo() };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export default async function ActivityPage() {
  const { data, error } = await loadAccountData();

  return (
    <div>
      <AccountSummary data={data} error={error} />
      <ModelUsageBreakdown />
      <ChatUsageLog />
    </div>
  );
}
