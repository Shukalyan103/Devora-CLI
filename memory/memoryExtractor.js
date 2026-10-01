import { generateText } from "ai";
import { z } from "zod";
import { getAgentModel } from "../aiconfig/ai.js";
import { cleanAndParseJson } from "../utils/jsonHelper.js";

const memorySchema = z.object({
  decisions: z.array(z.string()).default([]),
  importantFiles: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([])
});

export async function extractMemory(task, result) {
  try {
    const response = await generateText({
      model: getAgentModel(),

      system: `You are Devora's memory system.
Analyze this completed Devora task and extract useful information for future tasks on this project.

CRITICAL INSTRUCTIONS:
- You must output ONLY a valid JSON object.
- Do NOT output any markdown fences, conversational text, explanations, or thinking tags.
- Output structure:
{
  "decisions": ["string"],
  "importantFiles": ["string"],
  "notes": ["string"]
}`,

      prompt: `Task: ${task.title}
Description: ${task.description}
Result: ${result || "Task completed."}

JSON:`
    });

    const parsed = cleanAndParseJson(response.text);
    const validated = memorySchema.safeParse(parsed);

    if (validated.success) {
      return validated.data;
    }

    return {
      decisions: Array.isArray(parsed?.decisions) ? parsed.decisions.map(String) : [],
      importantFiles: Array.isArray(parsed?.importantFiles) ? parsed.importantFiles.map(String) : [],
      notes: Array.isArray(parsed?.notes) ? parsed.notes.map(String) : []
    };
  } catch (error) {
    // If memory extraction fails on free models, return empty memory safely without crashing
    return {
      decisions: [],
      importantFiles: [],
      notes: []
    };
  }
}