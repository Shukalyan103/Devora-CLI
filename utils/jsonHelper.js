/**
 * Utility to reliably extract and parse JSON from model responses,
 * handling reasoning tags (<think>...), markdown code fences, and conversational filler.
 */
export function cleanAndParseJson(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Empty or invalid text received for JSON parsing");
  }

  // 1. Strip reasoning / thinking tokens (e.g., DeepSeek R1 models)
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // 2. Check for markdown code blocks (```json ... ``` or ``` ... ```)
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }

  // 3. Try direct JSON.parse
  try {
    return JSON.parse(cleaned);
  } catch (_) {
    // Continue to fallback search
  }

  // 4. Find outermost object { ... }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = cleaned.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch (_) {
      // Continue to bracket search
    }
  }

  // 5. Find outermost array [ ... ]
  const firstBracket = cleaned.indexOf("[");
  const lastBracket = cleaned.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    const candidate = cleaned.slice(firstBracket, lastBracket + 1);
    try {
      return JSON.parse(candidate);
    } catch (_) {}
  }

  throw new Error("Could not parse valid JSON from model output");
}
