import { generateObject } from "ai";
import { z } from "zod";

import { getAgentModel } from "../aiconfig/ai.js";

const memorySchema = z.object({
  decisions: z.array(
    z.string()
  ),

  importantFiles: z.array(
    z.string()
  ),

  notes: z.array(
    z.string()
  )
});

export async function extractMemory(
  task,
  result
) {
  const response =
    await generateObject({
      model: getAgentModel(),

      schema: memorySchema,

      prompt: `
Analyze this completed Devora task.

Task:
${task.title}

Description:
${task.description}

Result:
${result}

Extract only information that is
likely to remain useful for future
work on this project.

Return:

- architectural decisions
- important files
- useful project notes

Do not invent information.
`
    });

  return response.object;
}