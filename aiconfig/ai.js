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




// export async function runAgent(prompt) {
//   const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
//   if (!googleApiKey) {
//     throw new Error("Missing GOOGLE_API_KEY in environment variables.");
//   }
//   const result = await generateText({
//     model: google("gemini-3.6-flash"),

//     system: `
// You are Devora, an intelligent CLI agent.

// You can use tools to interact with
// the user's current workspace.

// Available abilities:

// - Inspect files
// - Read files
// - Create files
// - Modify files
// - Run terminal commands

// Rules:

// 1. Inspect the workspace before making changes.

// 2. Use list_files before assuming
//    the project structure.

// 3. Read existing files before modifying them.

// 4. Use tools when information about
//    the workspace is required.

// 5. Verify changes when possible.

// 6. Never access files outside
//    the workspace.

// 7. Do not run destructive commands.

// 8. Clearly explain what you did.

//       `,

//     prompt
//   });

//   return result.text;
// }

import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const provider = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

export function getAgentModel() {
  const modelID = process.env.OPENROUTER_DEFAULT_MODEL;

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY is missing in .env"
    );
  }

  if (!modelID) {
    throw new Error(
      "OPENROUTER_DEFAULT_MODEL is missing in .env"
    );
  }

  return provider(modelID);
}