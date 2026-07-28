import type { ReactNode } from "react";
import Link from "next/link";

type CitationChipProps = {
  tag: string;
  label: string;
  href?: string;
};

const chipClassName =
  "inline-flex items-center gap-1.5 max-w-full border border-border bg-surface rounded-lg px-2 py-1 hover:border-info transition-colors";

// Compact Perplexity-style citation chip — a source reference shown above the
// assistant's synthesized answer, not a full result card. Multiple chips
// (even from different tool calls in the same turn) wrap into the same row
// because each renders as a natural-width flex child of the message's
// flex-wrap container (see ChatMessage.tsx's AssistantMessage).
export function CitationChip({ tag, label, href }: CitationChipProps) {
  const content = (
    <>
      <span className="text-[8px] font-bold uppercase tracking-wide text-info bg-info-tint rounded-[3px] px-1 py-px shrink-0">
        {tag}
      </span>
      <span className="text-[10px] font-medium text-text-primary truncate">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={chipClassName}>
        {content}
      </Link>
    );
  }
  return <div className={chipClassName}>{content}</div>;
}

export function CitationRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-[5px]">{children}</div>;
}
