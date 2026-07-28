"use client";

import { useId, useRef, useState } from "react";
import { AttachmentPrimitive, ComposerPrimitive, useAuiState } from "@assistant-ui/react";
import { ArrowUp, FileText, Paperclip, Square, Upload, X } from "lucide-react";
import { addUploadedDoc } from "@/lib/uploaded-docs";
import { ChatModelPicker } from "./ChatModelPicker";

function ComposerAttachmentChip() {
  return (
    <AttachmentPrimitive.Root className="flex items-center gap-1.5 max-w-[10rem] text-[11px] text-text-on-dark bg-white/10 rounded-full pl-2.5 pr-1 py-1">
      <FileText size={11} className="shrink-0" />
      <span className="truncate">
        <AttachmentPrimitive.Name />
      </span>
      <AttachmentPrimitive.Remove className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-text-on-dark-secondary hover:bg-white/15 hover:text-text-on-dark">
        <X size={10} />
      </AttachmentPrimitive.Remove>
    </AttachmentPrimitive.Root>
  );
}

function ComposerAttachments() {
  const hasAttachments = useAuiState((s) => s.composer.attachments.length > 0);
  if (!hasAttachments) return null;
  return (
    <div className="flex flex-wrap gap-1.5 px-3 pt-3">
      <ComposerPrimitive.Attachments components={{ Attachment: ComposerAttachmentChip }} />
    </div>
  );
}

function ComposerPrimaryAction() {
  const isRunning = useAuiState((s) => s.thread.isRunning);

  if (isRunning) {
    return (
      <ComposerPrimitive.Cancel
        title="Stop"
        className="w-[26px] h-[26px] rounded-full bg-info text-white flex items-center justify-center shrink-0 hover:bg-info/90"
      >
        <Square size={11} className="fill-current" />
      </ComposerPrimitive.Cancel>
    );
  }

  return (
    <ComposerPrimitive.Send
      title="Send"
      className="w-[26px] h-[26px] rounded-full bg-info text-white flex items-center justify-center shrink-0 hover:bg-info/90 disabled:opacity-40"
    >
      <ArrowUp size={14} />
    </ComposerPrimitive.Send>
  );
}

export function ChatInput() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const uploadInputId = useId();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      const content = await file.text();
      addUploadedDoc({ name: file.name, content });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploadNotice(
      files.length === 1 ? `Added "${files[0].name}" to Docs` : `Added ${files.length} files to Docs`,
    );
    setTimeout(() => setUploadNotice(null), 3000);
  }

  return (
    <ComposerPrimitive.Root className="p-3 bg-chrome-sidebar">
      {uploadNotice && <p className="text-[11px] text-text-on-dark-secondary mb-1.5 px-1">{uploadNotice}</p>}
      <div className="rounded-2xl border border-white/15 bg-white/5 focus-within:border-info/60 transition-colors">
        <ComposerAttachments />
        <ComposerPrimitive.Input
          rows={1}
          placeholder="How can I help you today?"
          // 16px (text-base) on mobile avoids iOS Safari's auto-zoom on focus
          // for inputs under that size; the compact 12px only applies at md+.
          className="w-full bg-transparent text-text-on-dark placeholder-text-on-dark-secondary px-3.5 pt-2.5 pb-1 text-base md:text-[12px] font-sans resize-none outline-none max-h-30"
        />
        <div className="flex items-center gap-1 px-1.5 pb-1.5 pt-0.5">
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.txt,text/plain,text/markdown"
            multiple
            className="hidden"
            id={uploadInputId}
            onChange={(e) => handleFiles(e.target.files)}
          />
          <label
            htmlFor={uploadInputId}
            title="Upload a document to Docs"
            className="w-[25px] h-[25px] rounded-[7px] flex items-center justify-center cursor-pointer text-text-on-dark-secondary hover:bg-white/10 hover:text-text-on-dark"
          >
            <Upload size={13} />
          </label>
          <ComposerPrimitive.AddAttachment
            title="Attach a file to this message"
            className="w-[25px] h-[25px] rounded-[7px] flex items-center justify-center text-text-on-dark-secondary hover:bg-white/10 hover:text-text-on-dark"
          >
            <Paperclip size={13} />
          </ComposerPrimitive.AddAttachment>
          <ChatModelPicker />
          <div className="flex-1" />
          <ComposerPrimaryAction />
        </div>
      </div>
    </ComposerPrimitive.Root>
  );
}
