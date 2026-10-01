export function buildContext({
  goal,
  task,
  projectMemory = {},
  globalMemory = {},
  completedTasks = []
}) {
  const importantFiles = projectMemory.importantFiles ?? [];
  const decisions = projectMemory.decisions ?? [];
  const projectNotes = projectMemory.notes ?? [];
  const preferences = globalMemory.preferences ?? [];

  // Match item.summary created in orchestrator.js
  const completedList = completedTasks.length
    ? completedTasks
      .map(item => `- **${item.title}**: ${item.summary || "Completed"}`)
      .join("\n")
    : "None";

  return `
You are Devora, an intelligent CLI software engineering agent.

### Goal
${goal ?? "Not specified"}

### Current Task
**${task?.title ?? "Unknown Task"}**
${task?.description ?? "No description available"}

### Project Context
- **Important Files:** ${importantFiles.join(", ") || "None"}
- **Decisions:** ${decisions.join("; ") || "None"}
- **Notes:** ${projectNotes.join("; ") || "None"}
${preferences.length ? `- **Preferences:** ${preferences.join("; ")}` : ""}

### Completed Tasks
${completedList}

### Guidelines
- Always inspect files before modifying them.
- Prefer 'modify_file' for small changes to conserve tokens; use 'write_file' for new or full-file rewrites.
- Execute terminal commands safely within the workspace.
- Give concise summaries of changes made.
`.trim();
}
