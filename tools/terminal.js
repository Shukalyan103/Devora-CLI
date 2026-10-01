import { exec } from "node:child_process";
import { promisify } from "node:util";

import { tool } from "ai";
import { z } from "zod";

import { WORKSPACE } from "../utils/workspace.js";

const execAsync = promisify(exec);

const DANGEROUS_PATTERNS = [
  /rm\s+-rf\s+[\/\\]/i,
  /rmdir\s+\/s\s+\/q\s+[c-z]:\\/i,
  /format\s+[c-z]:/i,
  /:(){ :|:& };:/,
  /mkfs/i,
  /dd\s+if=/i
];


const truncateOutput=(text , maxLines = 40)=>{
    if(!text) return;

    const lines = text.split("\n")

    if(lines.length <= maxLines){
      return text
    }

    const half = Math.floor(maxLines /2)

    return [
      ...lines.slice(0,half),
      `\n... [Truncated ${lines.length - maxLines}
      lines] ... \n`,
      ...lines.slice(-half)
    ].join("\n")
}



export const runCommand = tool({
  description: `
Run a terminal command inside the workspace.

Use this for:
- npm commands
- node commands
- tests
- builds
- git status

Do not run dangerous commands.
  `,

  inputSchema: z.object({
    command: z
      .string()
      .describe(
        "The terminal command to execute."
      )
  }),

  execute: async ({ command }) => {

   
    if (DANGEROUS_PATTERNS.some(pattern => pattern.test(command.trim()))) {
      return {
        success: false,
        error: `Command rejected for security reasons: dangerous command detected.`
      };
    }

    try {

      const {
        stdout,
        stderr
      } = await execAsync(command, {
        cwd: WORKSPACE,
        timeout: 30000,
        maxBuffer: 1024 * 1024
      });

      return {
        success: true,
        stdout :truncateOutput(stdout),
        stderr:truncateOutput(stderr)
      };

    } catch (error) {

      return {
        success: false,
        stdout: truncateOutput(error.stdout) || "",
        stderr: truncateOutput(error.stderr) || "",
        error: error.message
      };
    }
  }
});