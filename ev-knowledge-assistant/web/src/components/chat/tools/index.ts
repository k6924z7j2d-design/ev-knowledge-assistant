import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import { EvGarageResult } from "./EvGarageResult";
import { KnowledgeDocsResult } from "./KnowledgeDocsResult";
import { UploadedDocsResult } from "./UploadedDocsResult";

export const toolRenderers: Record<string, ToolCallMessagePartComponent> = {
  searchEvGarage: EvGarageResult,
  searchKnowledgeDocs: KnowledgeDocsResult,
  searchUploadedDocs: UploadedDocsResult,
};
