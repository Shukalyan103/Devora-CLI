import "dotenv/config";
import readline from "node:readline"
import { runAgent } from "../aiconfig/ai.config.js";
const args = process.argv.slice(2);

// Direct command:
// claw "Explain JavaScript promises"
if (args.length > 0) {
  const prompt = args.join(" ");

  try {
    console.log("\n🤖 Thinking...\n");

    const response = await runAgent(prompt);

    console.log(response);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }

  process.exit(0);
}

// Interactive mode
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "claw> "
});

console.log(`
╔══════════════════════════════╗
║        🦀 CLAW AGENT         ║
║      Gemini • Phase 1        ║
╚══════════════════════════════╝

Type your request.
Type "exit" to quit.
`);

rl.prompt();

rl.on("line", async (input) => {
  const prompt = input.trim();

  if (!prompt) {
    rl.prompt();
    return;
  }

  if (prompt.toLowerCase() === "exit") {
    rl.close();
    return;
  }

  try {
    console.log("\n🤖 Thinking...\n");

    const response = await runAgent(prompt);

    console.log(response);
    console.log();
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }

  rl.prompt();
});

rl.on("close", () => {
  console.log("\nGoodbye! 👋");
  process.exit(0);
});