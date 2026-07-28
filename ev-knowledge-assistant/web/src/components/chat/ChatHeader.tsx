import type { ReactNode } from "react";
import { Bot, History, Plus, PanelRightClose } from "lucide-react";

type ChatHeaderProps = {
  view: "chat" | "history";
  onToggleHistory: () => void;
  onNewChat: () => void;
  onDismiss: () => void;
  dismissIcon?: ReactNode;
  dismissLabel?: string;
};

export function ChatHeader({
  view,
  onToggleHistory,
  onNewChat,
  onDismiss,
  dismissIcon,
  dismissLabel = "Collapse",
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-[14px] py-[10px] bg-chrome-sidebar">
      <div className="flex items-center gap-2 text-[12px] font-semibold text-text-on-dark">
        <Bot size={13} className="text-info" />
        Assistant
      </div>
      <div className="flex items-center gap-[3px] text-text-on-dark-secondary">
        <button
          type="button"
          onClick={onNewChat}
          title="New chat"
          className="w-[23px] h-[23px] rounded-md flex items-center justify-center hover:bg-white/5 hover:text-text-on-dark"
        >
          <Plus size={13} />
        </button>
        <button
          type="button"
          onClick={onToggleHistory}
          title="History"
          className={[
            "w-[23px] h-[23px] rounded-md flex items-center justify-center hover:bg-white/5 hover:text-text-on-dark",
            view === "history" ? "bg-info-tint text-info" : "",
          ].join(" ")}
        >
          <History size={13} />
        </button>
        <button
          type="button"
          onClick={onDismiss}
          title={dismissLabel}
          className="w-[23px] h-[23px] rounded-md flex items-center justify-center hover:bg-white/5 hover:text-text-on-dark"
        >
          {dismissIcon ?? <PanelRightClose size={13} />}
        </button>
      </div>
    </div>
  );
}
