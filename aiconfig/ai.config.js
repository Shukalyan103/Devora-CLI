import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function runAgent(prompt) {
  const result = await generateText({
    model: google("gemini-2.5-flash"),

    system: `
You are Claw, a helpful command-line AI assistant.

You are currently in Phase 1.

Your responsibilities:
- Understand the user's request.
- Give accurate answers.
- Explain technical concepts clearly.
- Generate JavaScript and other code when requested.

You do NOT currently have access to:
- Files
- Terminal
- Git
- Web browser
- WebContainer
- External tools

Do not claim that you executed something when you did not.
`,

    prompt
  });

  return result.text;
}