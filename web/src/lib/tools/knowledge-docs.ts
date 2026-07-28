import { z } from "zod";
import { tool } from "ai";
import { listBuiltInDocs } from "@/lib/docs";
import { extractSnippets } from "./snippet";

const MAX_RESULTS = 5;

export const knowledgeDocsTool = tool({
  description:
    "Search the app's built-in EV knowledge docs (curated markdown reference material, not the user's uploaded documents) for a keyword or phrase. Returns matching doc titles and short excerpts.",
  inputSchema: z.object({
    query: z.string().describe("Keyword or phrase to search for"),
  }),
  execute: async ({ query }) => {
    const docs = await listBuiltInDocs();
    const needle = query.toLowerCase();
    return docs
      .map((doc) => ({
        filename: doc.filename,
        title: doc.title,
        snippets: extractSnippets(doc.content, needle),
      }))
      .filter((match) => match.snippets.length > 0)
      .slice(0, MAX_RESULTS);
  },
});
