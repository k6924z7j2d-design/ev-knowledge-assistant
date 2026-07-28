import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  ActionBarPrimitive,
  AttachmentPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
} from "@assistant-ui/react";
import type { TextMessagePartComponent, ReasoningMessagePartComponent } from "@assistant-ui/react";
import { Bot, Check, ChevronLeft, ChevronRight, Copy, FileText, Pencil, RotateCw } from "lucide-react";
import { ChatReasoning } from "./ChatReasoning";
import { toolRenderers } from "./tools";

// Assistant-ui invokes Text once with a synthetic empty running part when a
// message has no content yet, which is what covers the pre-first-token gap.
// `w-full` makes this part a full-width flex child of AssistantMessage's
// flex-wrap row, forcing it onto its own line below any citation chips that
// preceded it (see AssistantMessage below).
const MarkdownText: TextMessagePartComponent = ({ text, status }) => {
  if (!text) {
    if (status.type === "running") {
      return <div className="w-full text-[11.5px] text-text-secondary animate-pulse">Initializing...</div>;
    }
    return null;
  }

  return (
    <div className="w-full prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 prose-p:text-[11.5px] prose-li:text-[11.5px]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto">
              <table {...props}>{children}</table>
            </div>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

// Same full-width trick as MarkdownText — reasoning always gets its own row.
const ReasoningPart: ReasoningMessagePartComponent = ({ text, status }) => (
  <div className="w-full">
    <ChatReasoning text={text} streaming={status.type === "running"} />
  </div>
);

const PlainText: TextMessagePartComponent = ({ text }) => <>{text}</>;

function AttachmentChip() {
  return (
    <AttachmentPrimitive.Root className="flex items-center gap-1.5 max-w-[12rem] text-[10px] bg-info/10 text-info rounded-full pl-2 pr-2 py-[3px]">
      <FileText size={10} className="shrink-0" />
      <span className="truncate">
        <AttachmentPrimitive.Name />
      </span>
    </AttachmentPrimitive.Root>
  );
}

function BranchPicker({ className }: { className?: string }) {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={`flex items-center gap-0.5 text-[10px] text-text-tertiary ${className ?? ""}`}
    >
      <BranchPickerPrimitive.Previous className="w-4 h-4 rounded flex items-center justify-center hover:bg-bg hover:text-text-primary disabled:opacity-30">
        <ChevronLeft size={11} />
      </BranchPickerPrimitive.Previous>
      <span className="tabular-nums">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next className="w-4 h-4 rounded flex items-center justify-center hover:bg-bg hover:text-text-primary disabled:opacity-30">
        <ChevronRight size={11} />
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
}

export function UserMessage() {
  return (
    <div className="group flex flex-col items-end gap-1 max-w-[88%] self-end">
      <div className="flex flex-wrap justify-end gap-1.5">
        <MessagePrimitive.Attachments components={{ Attachment: AttachmentChip }} />
      </div>
      <MessagePrimitive.Root className="text-[11.5px] leading-[1.5] px-[11px] py-[7px] rounded-xl border border-border bg-surface text-text-primary whitespace-pre-wrap">
        <MessagePrimitive.Parts components={{ Text: PlainText }} />
      </MessagePrimitive.Root>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ActionBarPrimitive.Root hideWhenRunning className="flex items-center gap-0.5">
          <ActionBarPrimitive.Edit
            title="Edit"
            className="w-4 h-4 rounded flex items-center justify-center text-text-tertiary hover:bg-bg hover:text-text-primary"
          >
            <Pencil size={10} />
          </ActionBarPrimitive.Edit>
        </ActionBarPrimitive.Root>
        <BranchPicker />
      </div>
    </div>
  );
}

export function UserEditComposer() {
  return (
    <ComposerPrimitive.Root className="max-w-[88%] self-end w-full flex flex-col gap-1.5 rounded-xl bg-info/10 border border-info/30 p-2.5">
      <ComposerPrimitive.Input
        rows={1}
        // 16px (text-base) on mobile avoids iOS Safari's auto-zoom on focus.
        className="w-full bg-transparent text-base md:text-[11.5px] text-text-primary resize-none outline-none max-h-40"
        autoFocus
      />
      <div className="flex justify-end gap-1.5">
        <ComposerPrimitive.Cancel className="text-[10.5px] px-2.5 py-1 rounded-md text-text-secondary hover:bg-bg">
          Cancel
        </ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send className="text-[10.5px] px-2.5 py-1 rounded-md bg-info text-white hover:bg-info/90">
          Send
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
}

export function AssistantMessage() {
  return (
    <div className="group flex items-start gap-2 self-start max-w-full w-full">
      <div className="mt-0.5 w-5 h-5 rounded-[6px] bg-chrome-sidebar flex items-center justify-center shrink-0 text-info">
        <Bot size={11} />
      </div>
      <div className="min-w-0 flex-1 flex flex-col gap-1.5">
        <MessagePrimitive.Root className="flex flex-wrap gap-[5px] items-start text-[11.5px] leading-relaxed text-text-primary">
          <MessagePrimitive.Parts
            components={{ Text: MarkdownText, Reasoning: ReasoningPart, tools: { by_name: toolRenderers } }}
          />
        </MessagePrimitive.Root>
        <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity text-[10px] text-text-tertiary">
          <ActionBarPrimitive.Root hideWhenRunning className="flex items-center gap-0.5">
            <ActionBarPrimitive.Copy
              title="Copy"
              className="group/copy relative w-4 h-4 rounded flex items-center justify-center hover:bg-bg hover:text-text-primary"
            >
              <Copy size={10} className="transition-opacity group-data-[copied]/copy:opacity-0" />
              <Check
                size={10}
                className="absolute inset-0 m-auto opacity-0 transition-opacity group-data-[copied]/copy:opacity-100 text-success"
              />
            </ActionBarPrimitive.Copy>
            <ActionBarPrimitive.Reload
              title="Regenerate"
              className="w-4 h-4 rounded flex items-center justify-center hover:bg-bg hover:text-text-primary"
            >
              <RotateCw size={10} />
            </ActionBarPrimitive.Reload>
          </ActionBarPrimitive.Root>
          <BranchPicker />
        </div>
      </div>
    </div>
  );
}
