"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  deleteUploadedDoc,
  listUploadedDocs,
  UPLOADED_DOCS_UPDATED_EVENT,
  type UploadedDoc,
} from "@/lib/uploaded-docs";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function UploadedDocsList() {
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setDocs(listUploadedDocs());
    refresh();
    window.addEventListener(UPLOADED_DOCS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(UPLOADED_DOCS_UPDATED_EVENT, refresh);
  }, []);

  if (docs.length === 0) {
    return (
      <p className="text-text-secondary text-sm mt-3">No uploaded documents yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-3">
      {docs.map((doc) => (
        <div key={doc.id} className="border border-border rounded-xl p-3.5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
              className="text-left flex-1 min-w-0"
            >
              <div className="font-medium text-sm truncate">{doc.name}</div>
              <div className="text-text-tertiary text-[12px]">
                {formatSize(doc.sizeBytes)} · {new Date(doc.uploadedAt).toLocaleString()}
              </div>
            </button>
            <button
              type="button"
              onClick={() => deleteUploadedDoc(doc.id)}
              className="text-text-tertiary hover:text-accent shrink-0"
              aria-label="Delete document"
            >
              <Trash2 size={15} />
            </button>
          </div>
          {expandedId === doc.id && (
            <pre className="mt-3 text-[12px] leading-relaxed whitespace-pre-wrap bg-bg rounded-lg p-3 max-h-64 overflow-y-auto">
              {doc.content}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
