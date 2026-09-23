import fs from "node:fs/promises";
import path from "node:path";

import { tool } from "ai";
import { z } from "zod";
import { getSafePath, WORKSPACE } from "../utils/workspace.js"


const SKILLS_DIR = path.join(WORKSPACE, "skills");

const ignoreList = ["node_modules", ".git", "dist"]

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
  description: "Delete a file from the workspace.",
  // schema for the input of the tool
  inputSchema: z.object({
    path: z.string().describe(
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

export const createFile = tool({
  description: "Create a new file with initial content.",
  inputSchema: z.object({
    path: z.string().describe("Relative path of the new file."),
    content: z.string().optional().default("").describe("Initial file content.")
  }),
  execute: async ({ path: filePath, content = "" }) => {
    const fullPath = getSafePath(filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, "utf8");
    return { success: true, message: `Created file: ${filePath}` };
  }
});

export const createFolder = tool({
  description: "Create a new directory (and parent directories if needed).",
  inputSchema: z.object({
    path: z.string().describe("Relative directory path to create.")
  }),
  execute: async ({ path: dirPath }) => {
    const fullPath = getSafePath(dirPath);
    await fs.mkdir(fullPath, { recursive: true });
    return { success: true, message: `Created folder: ${dirPath}` };
  }
});

export const modifyFile = tool({
  description: "Modify an existing file by replacing target text with new text.",
  inputSchema: z.object({
    path: z.string().describe("Relative path of the file to modify."),
    oldText: z.string().describe("The exact existing text to replace."),
    newText: z.string().describe("The new text to insert in place of oldText.")
  }),
  execute: async ({ path: filePath, oldText, newText }) => {
    const fullPath = getSafePath(filePath);
    const content = await fs.readFile(fullPath, "utf8");
    if (!content.includes(oldText)) {
      return {
        success: false,
        error: `Could not find target text in ${filePath}`
      };
    }
    const updatedContent = content.replace(oldText, newText);
    await fs.writeFile(fullPath, updatedContent, "utf8");
    return { success: true, message: `Successfully modified ${filePath}` };
  }
});

// Helper: recursive file walker
async function getFilesRecursively(dir, ignoreList = ["node_modules", ".git", "dist"]) {
  let results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoreList.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(await getFilesRecursively(full, ignoreList));
    } else {
      results.push(full);
    }
  }
  return results;
}

export const searchFiles = tool({
  description: "Search for a keyword or regex pattern across workspace files.",
  inputSchema: z.object({
    query: z.string().describe("Search query or pattern."),
    dir: z.string().optional().default(".").describe("Directory to search in.")
  }),
  execute: async ({ query, dir = "." }) => {
    const rootDir = getSafePath(dir);
    const files = await getFilesRecursively(rootDir);
    const matches = [];
    for (const filePath of files) {
      try {
        const content = await fs.readFile(filePath, "utf8");
        const lines = content.split("\n");
        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            matches.push({
              file: path.relative(WORKSPACE, filePath),
              line: index + 1,
              content: line.trim()
            });
          }
        });
      } catch {
        // Skip binary or unreadable files
      }
    }
    return { totalMatches: matches.length, matches: matches.slice(0, 50) };
  }
});

export const analyzeCodebase = tool({
  description: "Analyze the project structure, language breakdown, and key files.",
  inputSchema: z.object({
    path: z.string().optional().default(".").describe("Workspace root or subfolder.")
  }),
  execute: async ({ path: targetPath = "." }) => {
    const rootDir = getSafePath(targetPath);
    const allFiles = await getFilesRecursively(rootDir);
    const extensions = {};
    for (const file of allFiles) {
      const ext = path.extname(file) || "other";
      extensions[ext] = (extensions[ext] || 0) + 1;
    }
    let packageJson = null;
    try {
      const pkg = await fs.readFile(path.join(WORKSPACE, "package.json"), "utf8");
      packageJson = JSON.parse(pkg);
    } catch { }
    return {
      totalFiles: allFiles.length,
      fileTypes: extensions,
      packageDetails: packageJson
        ? {
          name: packageJson.name,
          version: packageJson.version,
          dependencies: Object.keys(packageJson.dependencies || {})
        }
        : null
    };
  }
});


// 6. List Skills
export const listSkills = tool({
  description: "List available agent skills from the skills directory.",
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const files = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
      const skills = files
        .filter((f) => f.isDirectory() || f.name.endsWith(".md"))
        .map((f) => f.name.replace(".md", ""));
      return { skills };
    } catch {
      return { skills: [], message: "No skills directory found." };
    }
  }
});
// 7. Read Skill
export const readSkill = tool({
  description: "Read the detailed instructions for a specific skill.",
  inputSchema: z.object({
    name: z.string().describe("The name of the skill to read.")
  }),
  execute: async ({ name }) => {
    try {
      let skillPath = path.join(SKILLS_DIR, `${name}.md`);
      try {
        await fs.access(skillPath);
      } catch {
        skillPath = path.join(SKILLS_DIR, name, "SKILL.md");
      }
      const content = await fs.readFile(skillPath, "utf8");
      return { skill: name, instructions: content };
    } catch {
      return { error: `Skill "${name}" was not found.` };
    }
  }
});