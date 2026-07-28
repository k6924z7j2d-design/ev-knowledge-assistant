"use client";

import { useAui } from "@assistant-ui/react";
import { Bot } from "lucide-react";

const SUGGESTIONS = [
  { tag: "Garage", text: "Compare my shortlisted EVs" },
  { tag: "Docs", text: "What does Level 2 charging mean?" },
  { tag: "Uploads", text: "Search my uploaded docs" },
];

export function ChatEmptyState() {
  const aui = useAui();

  function sendSuggestion(text: string) {
    aui.thread().append({ role: "user", content: [{ type: "text", text }] });
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-4 py-5 gap-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-[34px] h-[34px] rounded-[10px] bg-chrome-sidebar flex items-center justify-center text-info">
          <Bot size={16} />
        </div>
        <p className="text-[13px] font-semibold text-text-primary">Ask about your garage, docs, or usage</p>
        <p className="text-[10.5px] text-text-secondary max-w-[22ch] leading-[1.5]">
          Grounded in your shortlisted EVs, the knowledge base, and anything you&apos;ve uploaded.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        {SUGGESTIONS.map(({ tag, text }) => (
          <button
            key={text}
            type="button"
            onClick={() => sendSuggestion(text)}
            className="text-left border border-border rounded-[9px] bg-surface px-2.5 py-[7px] hover:border-info transition-colors"
          >
            <span className="block text-[8.5px] font-bold uppercase tracking-wide text-info mb-px">{tag}</span>
            <span className="text-[11px] font-medium text-text-primary">{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
