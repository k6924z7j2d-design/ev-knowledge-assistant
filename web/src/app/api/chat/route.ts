import { streamText, convertToModelMessages, stepCountIs, type UIMessage, type ToolSet } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import type { ToolJSONSchema } from "assistant-stream";
import { DEFAULT_MODEL } from "@/lib/openrouter";
import { evGarageTool } from "@/lib/tools/ev-garage";
import { knowledgeDocsTool } from "@/lib/tools/knowledge-docs";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {
  const {
    messages,
    model: requestedModel,
    tools: frontendToolSchemas,
  }: { messages: UIMessage[]; model?: string; tools?: Record<string, ToolJSONSchema> } = await request.json();
  const model = requestedModel || process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

  // Server-executed tools plus schemas for tools the client runs itself
  // (e.g. searchUploadedDocs, which reads localStorage) — forwarded by
  // AssistantChatTransport on every request.
  const tools: ToolSet = {
    searchEvGarage: evGarageTool,
    searchKnowledgeDocs: knowledgeDocsTool,
    ...frontendTools(frontendToolSchemas ?? {}),
  };

  const result = streamText({
    model: openrouter(model),
    // Without this, streamText stops after a single tool call and never
    // turns the tool result into a natural-language answer.
    stopWhen: stepCountIs(5),
    system:
      "You are the assistant embedded in an EV research dashboard. Use searchEvGarage for questions " +
      "about the user's shortlisted vehicles (specs, pricing, range, charging, reliability). Use " +
      "searchKnowledgeDocs for general EV reference material. Use searchUploadedDocs for documents the " +
      "user uploaded on the Docs page in this session. Prefer calling a tool and grounding your answer " +
      "in its results over answering from general knowledge when one applies.",
    messages: await convertToModelMessages(messages, { tools }),
    tools,
  });

  return result.toUIMessageStreamResponse({
    // Without this, a failed request (bad API key, invalid model, rate limit)
    // streams back a generic opaque error with no way to diagnose it.
    onError: (error) => (error instanceof Error ? error.message : "Something went wrong."),
    messageMetadata: ({ part }) =>
      part.type === "finish"
        ? {
            model,
            usage: {
              inputTokens: part.totalUsage.inputTokens ?? 0,
              outputTokens: part.totalUsage.outputTokens ?? 0,
              totalTokens: part.totalUsage.totalTokens ?? 0,
            },
          }
        : undefined,
  });
}
