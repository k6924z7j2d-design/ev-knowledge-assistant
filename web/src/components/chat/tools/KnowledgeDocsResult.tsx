import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import { CitationChip, CitationRow } from "./CitationChip";

type DocMatch = { filename: string; title: string; snippets: string[] };

export const KnowledgeDocsResult: ToolCallMessagePartComponent = ({ result, status }) => {
  if (status.type === "running") {
    return <div className="text-[10.5px] text-text-secondary animate-pulse">Searching knowledge docs...</div>;
  }

  const matches = (result as DocMatch[] | undefined) ?? [];
  if (matches.length === 0) {
    return <div className="text-[10.5px] text-text-secondary">No matching docs found.</div>;
  }

  return (
    <CitationRow>
      {matches.map((doc) => (
        <CitationChip key={doc.filename} tag="Docs" label={doc.title} />
      ))}
    </CitationRow>
  );
};
