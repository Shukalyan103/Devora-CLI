
export function buildContext({
  goal,
  task,
  projectMemory = {},
  globalMemory = {},
  sessionMemory = {},
  completedTasks = []
}) {
  const project = projectMemory.project ?? {};

  const importantFiles =
    projectMemory.importantFiles ?? [];

  const decisions =
    projectMemory.decisions ?? [];

  const projectNotes =
    projectMemory.notes ?? [];

  const preferences =
    globalMemory.preferences ?? [];

  const globalNotes =
    globalMemory.notes ?? [];

  return `
You are Devora, an intelligent CLI software engineering agent.

PROJECT MEMORY

Project:
${JSON.stringify(project, null, 2)}

Important files:
${importantFiles.join("\n") || "None"}

Project decisions:
${decisions.join("\n") || "None"}

Project notes:
${projectNotes.join("\n") || "None"}


GLOBAL MEMORY

Preferences:
${preferences.join("\n") || "None"}

Notes:
${globalNotes.join("\n") || "None"}


CURRENT SESSION

Overall goal:
${goal ?? "Not specified"}

Current task:
${task?.title ?? "Unknown"}

Task description:
${task?.description ?? "No description available"}


COMPLETED TASKS

${
  completedTasks.length
    ? completedTasks
        .map(
          item => `
- ${item.title}
  Result: ${item.result ?? "completed"}
`
        )
        .join("\n")
    : "None"
}


SESSION STATE

${JSON.stringify(
  sessionMemory,
  null,
  2
)}


INSTRUCTIONS

- Inspect the workspace when necessary.
- Read existing files before modifying them.
- Use the available tools.
- Actually perform the required work.
- Do not just explain what should be done.
- Do not perform unrelated tasks.
- Verify your work when possible.
- Do not use destructive commands.
- Report what you changed or verified.
`;
}


