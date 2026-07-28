import { MessageSquare, Trash2 } from "lucide-react";
import type { ChatSession } from "@/lib/chat-sessions";

type ChatHistoryListProps = {
  sessions: ChatSession[];
  activeId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ChatHistoryList({
  sessions,
  activeId,
  onSelect,
  onDelete,
}: ChatHistoryListProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-[11.5px] text-text-secondary px-4 text-center">
        No past conversations yet.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
      {sessions.map((session) => (
        <div
          key={session.id}
          onClick={() => onSelect(session.id)}
          className={[
            "group flex items-center gap-2 rounded-lg border px-2.5 py-2 cursor-pointer text-[11.5px] transition-colors",
            session.id === activeId
              ? "border-info/30 bg-info-tint text-text-primary"
              : "border-border bg-surface hover:border-info text-text-secondary",
          ].join(" ")}
        >
          <MessageSquare size={12} className="shrink-0 text-text-tertiary" />
          <span className="truncate flex-1">{session.title}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(session.id);
            }}
            className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center shrink-0 text-text-tertiary hover:bg-accent-tint hover:text-accent"
            aria-label="Delete conversation"
          >
            <Trash2 size={11} />
          </button>
        </div>
      ))}
    </div>
  );
}
