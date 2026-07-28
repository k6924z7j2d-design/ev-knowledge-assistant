import { DocsUploader } from "@/components/docs/DocsUploader";
import { UploadedDocsList } from "@/components/docs/UploadedDocsList";
import { listBuiltInDocs } from "@/lib/docs";

export default async function DocsPage() {
  const builtInDocs = await listBuiltInDocs();

  return (
    <div className="max-w-[1390px] mx-auto px-10 py-8 pb-20">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold mb-1">Docs</h1>
        <p className="text-text-secondary text-[15px] m-0">
          Project documentation and uploaded reference material
        </p>
      </div>

      <div className="border border-border rounded-2xl p-5 bg-surface mb-4">
        <div className="text-[15px] font-semibold mb-3">Built-in docs</div>
        <div className="flex flex-col gap-2">
          {builtInDocs.map((doc) => (
            <details key={doc.filename} className="border border-border rounded-xl p-3.5">
              <summary className="cursor-pointer font-medium text-sm">
                {doc.title}
                <span className="text-text-tertiary text-[12px] ml-2">{doc.filename}</span>
              </summary>
              <pre className="mt-3 text-[12px] leading-relaxed whitespace-pre-wrap bg-bg rounded-lg p-3 max-h-96 overflow-y-auto">
                {doc.content}
              </pre>
            </details>
          ))}
        </div>
      </div>

      <div className="border border-border rounded-2xl p-5 bg-surface">
        <div className="text-[15px] font-semibold mb-3">Uploaded documents</div>
        <DocsUploader />
        <UploadedDocsList />
      </div>
    </div>
  );
}
