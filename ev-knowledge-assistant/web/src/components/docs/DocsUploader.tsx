"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { addUploadedDoc } from "@/lib/uploaded-docs";

export function DocsUploader() {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files)) {
      const content = await file.text();
      addUploadedDoc({ name: file.name, content });
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="border border-dashed border-border rounded-2xl p-5 text-center">
      <input
        ref={inputRef}
        type="file"
        accept=".md,.txt,text/plain,text/markdown"
        multiple
        className="hidden"
        id="docs-upload-input"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <label
        htmlFor="docs-upload-input"
        className="inline-flex items-center gap-2 text-info text-sm font-semibold cursor-pointer"
      >
        <Upload size={16} />
        Upload text or markdown documents
      </label>
      <p className="text-text-tertiary text-[12px] mt-1.5">
        Stored locally in this browser — not yet connected to retrieval/RAG.
      </p>
    </div>
  );
}
