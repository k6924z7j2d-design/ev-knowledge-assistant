"use client";

import { useState, type ReactNode } from "react";
import { SideNav } from "./SideNav";
import { BottomTabBar } from "./BottomTabBar";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ChatFab } from "@/components/chat/ChatFab";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SideNav />
      <main className="flex-1 min-w-0 overflow-y-auto pb-16 md:pb-0">{children}</main>
      <ChatPanel
        mobileOpen={mobileChatOpen}
        onMobileClose={() => setMobileChatOpen(false)}
      />
      <BottomTabBar />
      <ChatFab onClick={() => setMobileChatOpen(true)} />
    </div>
  );
}
