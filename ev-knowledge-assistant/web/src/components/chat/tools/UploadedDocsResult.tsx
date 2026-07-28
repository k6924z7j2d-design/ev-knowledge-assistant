import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import { CitationChip, CitationRow } from "./CitationChip";

type UploadedDocMatch = { id: string; name: string; snippets: string[] };

export const UploadedDocsResult: ToolCallMessagePartComponent = ({ result, status }) => {
  if (status.type === "running") {
    return <div className="text-[10.5px] text-text-secondary animate-pulse">Searching your uploaded docs...</div>;
  }

  const matches = (result as UploadedDocMatch[] | undefined) ?? [];
  if (matches.length === 0) {
    return <div className="text-[10.5px] text-text-secondary">No matching uploaded docs found.</div>;
  }

  return (
    <CitationRow>
      {matches.map((doc) => (
        <CitationChip key={doc.id} tag="Uploads" label={doc.name} />
      ))}
    </CitationRow>
  );
};
