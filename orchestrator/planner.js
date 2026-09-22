import { generateText } from "ai";
import { getAgentModel } from "../aiconfig/ai.js";

export async function createPlan(prompt) {
  const result = await generateText({
    model: getAgentModel(),

    system: `
You are Devora's planning system.

Break the user's request into clear executable tasks.

Rules:
- Create small practical tasks.
- Tasks must be executable by an AI coding agent.
- Do not create unnecessary tasks.
- Tasks should be ordered logically.
- Return ONLY valid JSON.

Format:

{
  "tasks": [
    {
      "title": "Short task title",
      "description": "What needs to be done"
    }
  ]
}
`,

    prompt
  });

  const text = result.text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      "Planner returned invalid JSON:\n" + text
    );
  }
}