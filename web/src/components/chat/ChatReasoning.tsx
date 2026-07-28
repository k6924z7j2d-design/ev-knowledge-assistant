"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

type ChatReasoningProps = {
  text: string;
  streaming: boolean;
};

export function ChatReasoning({ text, streaming }: ChatReasoningProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-1.5">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className={[
          "flex items-center gap-1.5 text-[12px] font-medium",
          streaming ? "text-info animate-pulse" : "text-text-secondary",
        ].join(" ")}
      >
        {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        {streaming ? "Thinking..." : "Show thinking"}
      </button>
      {expanded && (
        <div className="mt-1.5 text-[12.5px] leading-relaxed text-text-secondary italic border-l-2 border-border pl-2.5 whitespace-pre-wrap">
          {text}
        </div>
      )}
    </div>
  );
}
