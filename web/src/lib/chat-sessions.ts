import type { UIMessage } from "ai";

export type ChatSession = {
  id: string;
  title: string;
  messages: UIMessage[];
  updatedAt: number;
};

const STORAGE_KEY = "ev-chat-sessions";
const MAX_SESSIONS = 20;

function readAll(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(sessions: ChatSession[]) {
  if (typeof window === "undefined") return;
  const capped = [...sessions]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, MAX_SESSIONS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
}

export function listSessions(): ChatSession[] {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getSession(id: string): ChatSession | undefined {
  return readAll().find((s) => s.id === id);
}

export function deriveTitle(messages: UIMessage[]): string {
  const firstUserText = messages
    .find((m) => m.role === "user")
    ?.parts.find((p) => p.type === "text")?.text;
  if (!firstUserText) return "New chat";
  const trimmed = firstUserText.trim();
  return trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed || "New chat";
}

export function saveSession(session: ChatSession) {
  const rest = readAll().filter((s) => s.id !== session.id);
  writeAll([...rest, session]);
}

export function createSession(): ChatSession {
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    messages: [],
    updatedAt: Date.now(),
  };
}

export function deleteSession(id: string) {
  writeAll(readAll().filter((s) => s.id !== id));
}
