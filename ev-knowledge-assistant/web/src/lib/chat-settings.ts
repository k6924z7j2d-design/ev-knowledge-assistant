const STORAGE_KEY = "ev-chat-settings";

type ChatSettings = {
  model?: string;
  panelWidth?: number;
};

function readSettings(): ChatSettings {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatSettings) : {};
  } catch {
    return {};
  }
}

export function getSelectedModel(): string | undefined {
  return readSettings().model;
}

export function setSelectedModel(model: string | undefined) {
  if (typeof window === "undefined") return;
  const settings = readSettings();
  if (model) {
    settings.model = model;
  } else {
    delete settings.model;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function getPanelWidth(): number | undefined {
  return readSettings().panelWidth;
}

export function setPanelWidth(width: number) {
  if (typeof window === "undefined") return;
  const settings = readSettings();
  settings.panelWidth = width;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
