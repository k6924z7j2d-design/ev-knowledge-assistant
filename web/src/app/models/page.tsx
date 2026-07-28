import { ModelList } from "@/components/models/ModelList";
import { DEFAULT_MODEL, getOpenRouterModels, type OpenRouterModel } from "@/lib/openrouter";

async function loadModels(): Promise<
  { models: OpenRouterModel[]; error?: undefined } | { models?: undefined; error: string }
> {
  try {
    return { models: await getOpenRouterModels() };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export default async function ModelsPage() {
  const { models, error } = await loadModels();

  return (
    <div className="max-w-[1390px] mx-auto px-4 md:px-10 py-8 pb-20">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold mb-1">Models</h1>
        <p className="text-text-secondary text-[15px] m-0">
          Every model available through OpenRouter
        </p>
      </div>

      {error || !models ? (
        <div className="border border-border rounded-2xl p-5 bg-surface">
          <p className="text-text-secondary text-sm">
            Couldn&apos;t load the model list{error ? `: ${error}` : ""}.
          </p>
        </div>
      ) : (
        <ModelList models={models} defaultModel={process.env.OPENROUTER_MODEL || DEFAULT_MODEL} />
      )}
    </div>
  );
}
