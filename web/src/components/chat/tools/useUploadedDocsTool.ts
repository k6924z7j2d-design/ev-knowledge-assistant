"use client";

import { z } from "zod";
import { useAssistantTool, type AssistantToolProps } from "@assistant-ui/react";
import { listUploadedDocs } from "@/lib/uploaded-docs";
import { extractSnippets } from "@/lib/tools/snippet";
import { UploadedDocsResult } from "./UploadedDocsResult";

const MAX_RESULTS = 5;

type UploadedDocsArgs = { query: string };
type UploadedDocsResultItem = { id: string; name: string; snippets: string[] };

const uploadedDocsTool = {
  toolName: "searchUploadedDocs",
  type: "frontend",
  description:
    "Search documents the user has uploaded on the Docs page in this browser (distinct from the app's built-in knowledge docs). Returns matching document names and short excerpts.",
  parameters: z.object({
    query: z.string().describe("Keyword or phrase to search for"),
  }),
  execute: async ({ query }: UploadedDocsArgs): Promise<UploadedDocsResultItem[]> => {
    const docs = listUploadedDocs();
    const needle = query.toLowerCase();
    return docs
      .map((doc) => ({ id: doc.id, name: doc.name, snippets: extractSnippets(doc.content, needle) }))
      .filter((match) => match.snippets.length > 0)
      .slice(0, MAX_RESULTS);
  },
  render: UploadedDocsResult,
} satisfies AssistantToolProps<UploadedDocsArgs, UploadedDocsResultItem[]>;

// Registers the tool with the runtime for as long as ChatPanel is mounted —
// execution happens here in the browser since uploaded docs live in
// localStorage, not on the server.
export function useUploadedDocsTool() {
  useAssistantTool(uploadedDocsTool);
}
