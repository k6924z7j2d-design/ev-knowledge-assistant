"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { DEFAULT_MODEL } from "@/lib/openrouter";
import { getSelectedModel, setSelectedModel } from "@/lib/chat-settings";

// Curated free-tier OpenRouter models only, per explicit product direction —
// the full paid+free catalog lives on the Models page.
const CURATED_MODELS = [
  { id: "openai/gpt-oss-20b:free", label: "GPT-OSS 20B" },
  { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B" },
  { id: "deepseek/deepseek-chat-v3-0324:free", label: "DeepSeek V3" },
  { id: "qwen/qwen-2.5-72b-instruct:free", label: "Qwen 2.5 72B" },
  { id: "google/gemini-2.0-flash-exp:free", label: "Gemini 2.0 Flash" },
];

export function ChatModelPicker() {
  const [model, setModel] = useState<string>(DEFAULT_MODEL);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setModel(getSelectedModel() ?? DEFAULT_MODEL);
  }, []);

  function choose(id: string) {
    setSelectedModel(id);
    setModel(id);
  }

  const current = CURATED_MODELS.find((m) => m.id === model);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          title="Choose model"
          className="flex h-[22px] max-w-[8rem] items-center gap-1 rounded-full border border-white/15 px-2 text-[10px] font-semibold text-text-on-dark-secondary hover:border-info hover:text-info"
        >
          <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-success" />
          <span className="truncate">{current?.label ?? model}</span>
          <ChevronDown size={10} className="shrink-0 opacity-70" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={8}
          className="z-50 min-w-52 rounded-xl border border-border bg-surface p-1 shadow-lg"
        >
          {CURATED_MODELS.map((m) => (
            <DropdownMenu.Item
              key={m.id}
              onSelect={() => choose(m.id)}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-[12.5px] text-text-primary outline-none data-[highlighted]:bg-info-tint data-[highlighted]:text-info"
            >
              <span className="w-3.5 shrink-0">{m.id === model ? <Check size={12} /> : null}</span>
              <span className="truncate">{m.label}</span>
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item asChild>
            <Link
              href="/models"
              className="flex cursor-pointer items-center rounded-lg px-2.5 py-2 text-[12px] font-medium text-info outline-none data-[highlighted]:bg-info-tint"
            >
              Browse all models
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
