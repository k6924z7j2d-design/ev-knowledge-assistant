"use client";

import { Bot } from "lucide-react";

type ChatFabProps = {
  onClick: () => void;
};

export function ChatFab({ onClick }: ChatFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Open chat"
      className="md:hidden fixed right-4 bottom-20 z-40 w-14 h-14 rounded-full bg-info text-white flex items-center justify-center shadow-lg hover:bg-info/90"
    >
      <Bot size={22} />
    </button>
  );
}
