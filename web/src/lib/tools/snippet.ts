const SNIPPET_RADIUS = 80;
const MAX_SNIPPETS_PER_DOC = 2;

export function extractSnippets(content: string, needle: string): string[] {
  const lower = content.toLowerCase();
  const snippets: string[] = [];
  let fromIndex = 0;
  while (snippets.length < MAX_SNIPPETS_PER_DOC) {
    const idx = lower.indexOf(needle, fromIndex);
    if (idx === -1) break;
    const start = Math.max(0, idx - SNIPPET_RADIUS);
    const end = Math.min(content.length, idx + needle.length + SNIPPET_RADIUS);
    snippets.push(
      `${start > 0 ? "…" : ""}${content.slice(start, end).trim()}${end < content.length ? "…" : ""}`,
    );
    fromIndex = idx + needle.length;
  }
  return snippets;
}
