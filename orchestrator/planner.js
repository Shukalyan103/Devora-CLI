import { generateText } from "ai";
import { getAgentModel } from "../aiconfig/ai.js";
import { cleanAndParseJson } from "../utils/jsonHelper.js";
import z from "zod";

const planeSchema = z.object({
  tasks: z.array(z.object({
    title: z.string().describe("Short task title"),
    description: z.string().describe("What needs to be done")
  }))
});

export async function createPlan(prompt) {
  try {
    const result = await generateText({
      model: getAgentModel(),

      system: `You are Devora's planning system.
Break the user's request into clear, practical, executable tasks for an AI coding agent.

CRITICAL INSTRUCTIONS:
- You must output ONLY a valid JSON object.
- Do NOT output any markdown fences, conversational text, explanations, or thinking tags.
- Your output must strictly follow this JSON schema:
{
  "tasks": [
    {
      "title": "Short task title",
      "description": "What needs to be done"
    }
  ]
}`,
      prompt: `User Request:\n${prompt}\n\nPlan JSON:`
    });

    const parsed = cleanAndParseJson(result.text);
    const validated = planeSchema.safeParse(parsed);

    if (validated.success && validated.data.tasks.length > 0) {
      return validated.data;
    }

    if (parsed && Array.isArray(parsed.tasks) && parsed.tasks.length > 0) {
      return {
        tasks: parsed.tasks.map((t, idx) => ({
          title: String(t.title || `Task ${idx + 1}`),
          description: String(t.description || t.title || "Execute task")
        }))
      };
    }

    if (Array.isArray(parsed) && parsed.length > 0) {
      return {
        tasks: parsed.map((t, idx) => ({
          title: String(t.title || `Task ${idx + 1}`),
          description: String(t.description || t.title || "Execute task")
        }))
      };
    }
  } catch (error) {
    // If model output parsing fails on free models, fallback to executing the request directly
  }

  return {
    tasks: [
      {
        title: "Execute User Request",
        description: prompt
      }
    ]
  };
}