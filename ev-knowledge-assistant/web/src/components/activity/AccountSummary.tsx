import type { OpenRouterKeyInfo } from "@/lib/openrouter";

function formatUsd(value: number) {
  return `$${value.toFixed(2)}`;
}

export function AccountSummary({
  data,
  error,
}: {
  data?: OpenRouterKeyInfo;
  error?: string;
}) {
  if (error || !data) {
    return (
      <div className="border border-border rounded-2xl p-5 bg-surface">
        <div className="text-[15px] font-semibold mb-1.5">Account</div>
        <p className="text-text-secondary text-sm">
          Couldn&apos;t load your OpenRouter account info
          {error ? `: ${error}` : ""}. Make sure{" "}
          <code className="text-text-primary">OPENROUTER_API_KEY</code> is set in{" "}
          <code className="text-text-primary">web/.env.local</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
      <div className="border border-border rounded-2xl p-5 bg-surface">
        <div className="text-text-secondary text-sm">Credit limit</div>
        <div className="text-[28px] font-bold mt-2">
          {data.limit === null ? "Unlimited" : formatUsd(data.limit)}
        </div>
        {data.is_free_tier && (
          <div className="text-text-tertiary text-[13px] mt-2">Free tier</div>
        )}
      </div>

      <div className="border border-border rounded-2xl p-5 bg-surface">
        <div className="text-text-secondary text-sm">Remaining balance</div>
        <div className="text-[28px] font-bold mt-2">
          {data.limit_remaining === null ? "—" : formatUsd(data.limit_remaining)}
        </div>
      </div>

      <div className="border border-border rounded-2xl p-5 bg-surface">
        <div className="text-text-secondary text-sm">Usage today</div>
        <div className="text-[28px] font-bold mt-2">{formatUsd(data.usage_daily)}</div>
      </div>

      <div className="border border-border rounded-2xl p-5 bg-surface">
        <div className="text-text-secondary text-sm">Usage this week</div>
        <div className="text-[28px] font-bold mt-2">{formatUsd(data.usage_weekly)}</div>
      </div>

      <div className="border border-border rounded-2xl p-5 bg-surface">
        <div className="text-text-secondary text-sm">Usage this month</div>
        <div className="text-[28px] font-bold mt-2">{formatUsd(data.usage_monthly)}</div>
      </div>

      <div className="border border-border rounded-2xl p-5 bg-surface">
        <div className="text-text-secondary text-sm">All-time usage</div>
        <div className="text-[28px] font-bold mt-2">{formatUsd(data.usage)}</div>
      </div>
    </div>
  );
}
