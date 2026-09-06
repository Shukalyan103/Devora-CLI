import { exec } from "node:child_process";
import { promisify } from "node:util";

import { tool } from "ai";
import { z } from "zod";

import { WORKSPACE } from "../utils/workspace.js";

const execAsync = promisify(exec);


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
        stdout,
        stderr
      };

    } catch (error) {

      return {
        success: false,
        stdout: error.stdout || "",
        stderr: error.stderr || "",
        error: error.message
      };
    }
  }
});