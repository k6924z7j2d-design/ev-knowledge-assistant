"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import type { UIMessage } from "ai";
import {
  AssistantRuntimeProvider,
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
  ThreadPrimitive,
} from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { ChatHeader } from "./ChatHeader";
import { UserMessage, UserEditComposer, AssistantMessage } from "./ChatMessage";
import { useUploadedDocsTool } from "./tools/useUploadedDocsTool";
import { ChatInput } from "./ChatInput";
import { ChatEmptyState } from "./ChatEmptyState";
import { ChatHistoryList } from "./ChatHistoryList";
import { Bot, PanelRightOpen, Plus, X } from "lucide-react";
import {
  type ChatSession,
  createSession,
  deleteSession,
  deriveTitle,
  listSessions,
  saveSession,
} from "@/lib/chat-sessions";
import { appendUsageEntry } from "@/lib/usage-log";
import { getSelectedModel, getPanelWidth, setPanelWidth as savePanelWidth } from "@/lib/chat-settings";

type ChatUsageMetadata = {
  model: string;
  usage: { inputTokens: number; outputTokens: number; totalTokens: number };
};

type ChatPanelProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

const MIN_PANEL_WIDTH = 280;
const MAX_PANEL_WIDTH = 560;
const DEFAULT_PANEL_WIDTH = 320;

// Registers the uploaded-docs tool inside the runtime's context — must be a
// descendant of AssistantRuntimeProvider, so it can't live in ChatPanel itself.
function UploadedDocsToolRegistration() {
  useUploadedDocsTool();
  return null;
}

export function ChatPanel({ mobileOpen, onMobileClose }: ChatPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState<"chat" | "history">("chat");
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const initialized = useRef(false);

  const [panelWidth, setPanelWidthState] = useState(DEFAULT_PANEL_WIDTH);
  const panelWidthRef = useRef(panelWidth);
  const draggingRef = useRef(false);

  useEffect(() => {
    panelWidthRef.current = panelWidth;
  }, [panelWidth]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setActiveSession(listSessions()[0] ?? createSession());
    setPanelWidthState(getPanelWidth() ?? DEFAULT_PANEL_WIDTH);
  }, []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!draggingRef.current) return;
      const next = Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, window.innerWidth - e.clientX));
      setPanelWidthState(next);
    }
    function onMouseUp() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      savePanelWidth(panelWidthRef.current);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  function startResize(e: ReactMouseEvent) {
    e.preventDefault();
    draggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  const [transport] = useState(
    () =>
      new AssistantChatTransport({
        api: "/api/chat",
        // `body` already carries the frontend-tool schemas AssistantChatTransport
        // forwards from the runtime's model context — spread it first so
        // searchUploadedDocs still reaches the server, not just our own fields.
        prepareSendMessagesRequest: ({ id, messages, body }) => ({
          body: { ...body, id, messages, model: getSelectedModel() },
        }),
      }),
  );

  const activeSessionId = activeSession?.id;

  const [attachmentAdapter] = useState(
    () => new CompositeAttachmentAdapter([new SimpleTextAttachmentAdapter(), new SimpleImageAttachmentAdapter()]),
  );

  const runtime = useChatRuntime({
    id: activeSessionId,
    // react-ai-sdk nests its own `ai`/`@ai-sdk/react` versions, whose UIMessage
    // type doesn't structurally match this app's — same wire format, different
    // type identity, so the boundary needs a cast rather than a shared type.
    messages: activeSession?.messages as never,
    transport,
    adapters: { attachments: attachmentAdapter },
    onError: (error) => setRequestError(error.message || "Something went wrong sending your message."),
    onFinish: ({ message, messages }) => {
      setRequestError(null);
      if (!activeSessionId) return;
      saveSession({
        id: activeSessionId,
        title: deriveTitle(messages as unknown as UIMessage[]),
        messages: messages as unknown as UIMessage[],
        updatedAt: Date.now(),
      });

      const metadata = message.metadata as ChatUsageMetadata | undefined;
      if (metadata?.usage) {
        appendUsageEntry({
          timestamp: Date.now(),
          model: metadata.model,
          inputTokens: metadata.usage.inputTokens,
          outputTokens: metadata.usage.outputTokens,
          totalTokens: metadata.usage.totalTokens,
        });
      }
    },
  });

  // Sessions are read fresh from storage whenever the history view is shown,
  // rather than mirrored into state — avoids an effect just to keep a copy in sync.
  const sessions = view === "history" ? listSessions() : [];

  function handleNewChat() {
    setActiveSession(createSession());
    setRequestError(null);
    setView("chat");
  }

  function handleSelectSession(id: string) {
    const session = listSessions().find((s) => s.id === id);
    if (session) {
      setActiveSession(session);
      setRequestError(null);
      setView("chat");
    }
  }

  function handleDeleteSession(id: string) {
    deleteSession(id);
    if (id === activeSessionId) {
      setActiveSession(listSessions()[0] ?? createSession());
    }
  }

  function handleToggleHistory() {
    setView(view === "history" ? "chat" : "history");
  }

  const messageArea =
    view === "history" ? (
      <ChatHistoryList
        sessions={sessions}
        activeId={activeSessionId ?? ""}
        onSelect={handleSelectSession}
        onDelete={handleDeleteSession}
      />
    ) : (
      <>
        {requestError && (
          <div className="mx-3 mt-2 px-3 py-2 rounded-lg border border-accent/30 bg-accent-tint text-accent text-[12px]">
            {requestError}
          </div>
        )}
        <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
          <ThreadPrimitive.Empty>
            <ChatEmptyState />
          </ThreadPrimitive.Empty>
          <ThreadPrimitive.Messages components={{ UserMessage, UserEditComposer, AssistantMessage }} />
        </ThreadPrimitive.Viewport>
      </>
    );

  const desktopPanel = collapsed ? (
    <div className="hidden md:flex md:flex-col w-14 shrink-0 bg-chrome-sidebar items-center py-4">
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        title="Expand chat"
        className="group relative w-9 h-9 rounded-lg flex items-center justify-center text-info hover:bg-white/10"
      >
        <Bot size={18} className="transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0" />
        <PanelRightOpen
          size={18}
          className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
        />
      </button>

      <div className="flex-1" />

      <div className="group relative">
        <button
          type="button"
          onClick={() => {
            handleNewChat();
            setCollapsed(false);
          }}
          className="w-7 h-7 rounded-full bg-info text-white flex items-center justify-center hover:bg-info/90"
        >
          <Plus size={15} />
        </button>
        <span className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-1.5 whitespace-nowrap rounded-md bg-chrome-header px-2 py-1 text-[11px] text-text-on-dark opacity-0 transition-opacity group-hover:opacity-100">
          New Chat
        </span>
      </div>
    </div>
  ) : (
    <aside
      className="hidden md:flex md:flex-col relative shrink-0 border-l border-border bg-surface h-full"
      style={{ width: panelWidth }}
    >
      <div
        onMouseDown={startResize}
        title="Drag to resize"
        className="hidden md:block absolute -left-0.5 top-0 bottom-0 w-1 cursor-col-resize z-10 hover:bg-info/40 active:bg-info/60"
      />
      <ChatHeader
        view={view}
        onNewChat={handleNewChat}
        onToggleHistory={handleToggleHistory}
        onDismiss={() => setCollapsed(true)}
      />

      {messageArea}

      {view === "chat" && <ChatInput />}
    </aside>
  );

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <UploadedDocsToolRegistration />
      {desktopPanel}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-surface flex flex-col">
          <ChatHeader
            view={view}
            onNewChat={handleNewChat}
            onToggleHistory={handleToggleHistory}
            onDismiss={onMobileClose}
            dismissIcon={<X size={13} />}
            dismissLabel="Close"
          />

          {messageArea}

          {view === "chat" && <ChatInput />}
        </div>
      )}
    </AssistantRuntimeProvider>
  );
}
