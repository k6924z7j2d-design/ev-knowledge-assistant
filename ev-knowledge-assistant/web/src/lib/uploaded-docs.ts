export type UploadedDoc = {
  id: string;
  name: string;
  content: string;
  uploadedAt: number;
  sizeBytes: number;
};

const STORAGE_KEY = "ev-uploaded-docs";
export const UPLOADED_DOCS_UPDATED_EVENT = "ev-uploaded-docs-updated";

function readAll(): UploadedDoc[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as UploadedDoc[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(docs: UploadedDoc[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  window.dispatchEvent(new Event(UPLOADED_DOCS_UPDATED_EVENT));
}

export function listUploadedDocs(): UploadedDoc[] {
  return readAll().sort((a, b) => b.uploadedAt - a.uploadedAt);
}

export function addUploadedDoc(doc: { name: string; content: string }) {
  const entry: UploadedDoc = {
    id: crypto.randomUUID(),
    name: doc.name,
    content: doc.content,
    uploadedAt: Date.now(),
    sizeBytes: new Blob([doc.content]).size,
  };
  writeAll([...readAll(), entry]);
}

export function deleteUploadedDoc(id: string) {
  writeAll(readAll().filter((d) => d.id !== id));
}
