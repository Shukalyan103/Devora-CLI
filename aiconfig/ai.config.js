import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import "dotenv/config";
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv"


const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)



dotenv.config({
  path: path.resolve(__dirname, "../.env")
})




export async function runAgent(prompt) {
  const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!googleApiKey) {
    throw new Error("Missing GOOGLE_API_KEY in environment variables.");
  }
  const result = await generateText({
    model: google("gemini-2.5-flash"),

    system: `
You are Devora, a helpful command-line AI assistant.

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