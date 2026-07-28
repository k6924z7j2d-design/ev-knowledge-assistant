import { readdir, readFile } from "fs/promises";
import path from "path";

export type BuiltInDoc = {
  filename: string;
  title: string;
  content: string;
};

function deriveTitle(filename: string, content: string): string {
  const heading = content.match(/^#\s+(.+)$/m);
  return heading ? heading[1].trim() : filename;
}

export async function listBuiltInDocs(): Promise<BuiltInDoc[]> {
  const docsDir = path.join(process.cwd(), "..", "local", "docs");
  const entries = await readdir(docsDir);
  const mdFiles = entries.filter((f) => f.endsWith(".md"));

  return Promise.all(
    mdFiles.map(async (filename) => {
      const content = await readFile(path.join(docsDir, filename), "utf-8");
      return { filename, title: deriveTitle(filename, content), content };
    }),
  );
}
