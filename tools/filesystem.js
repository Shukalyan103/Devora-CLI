import fs from "node:fs/promises";
import path from "node:path";

import { tool } from "ai";
import { z } from "zod";
import {getSafePath} from "../utils/workspace.js"



export const listFiles = tool({
  description: `
List files and folders inside the workspace.

Use this tool to inspect the project structure.
  `,

  inputSchema: z.object({
    path: z
      .string()
      .optional()
      .describe(
        "Relative directory path. Default is the workspace root."
      )
  }),

  execute: async ({ path: directoryPath = "." }) => {

    const fullPath = getSafePath(directoryPath);

    const entries = await fs.readdir(
      fullPath,
      {
        withFileTypes: true
      }
    );

    return entries.map((entry) => ({
      name: entry.name,
      type: entry.isDirectory()
        ? "directory"
        : "file"
    }));
  }
});

export const readFile = tool({
  description: `
Read the contents of a text file.

Use this before modifying an existing file.
  `,

  inputSchema: z.object({
    path: z
      .string()
      .describe(
        "Relative path of the file to read."
      )
  }),

  execute: async ({ path: filePath }) => {

    const fullPath = getSafePath(filePath);

    const content = await fs.readFile(
      fullPath,
      "utf8"
    );

    return {
      path: filePath,
      content
    };
  }
});

export const writeFile = tool({
  description: `
Create or overwrite a file inside the workspace.

Always read an existing file before overwriting it.
  `,

  inputSchema: z.object({
    path: z
      .string()
      .describe(
        "Relative path of the file to write."
      ),

    content: z
      .string()
      .describe(
        "Complete content for the file."
      )
  }),

  execute: async ({
    path: filePath,
    content
  }) => {

    const fullPath = getSafePath(filePath);

    await fs.mkdir(
      path.dirname(fullPath),
      {
        recursive: true
      }
    );

    await fs.writeFile(
      fullPath,
      content,
      "utf8"
    );

    return {
      success: true,
      message: `File written successfully: ${filePath}`
    };
  }
});

export const deleteFile = tool({
  //description that what this tool does
  description :"Delete a file from the workspace.",
  // schema for the input of the tool
  inputSchema:z.object({
    path:z.string().describe(
      "relative path of the file to delete"
    )
  }),
// logi  for the tool that how it is excecting 
 execute: async ({ path: filePath }) => {
    const fullPath = getSafePath(filePath);
    await fs.unlink(fullPath);
    return { success: true, message: `Deleted ${filePath}` };
  }
})