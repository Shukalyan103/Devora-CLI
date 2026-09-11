
import { spinner } from "@clack/prompts";

const activeSpinners = new Map();

export function logAction(event) {
  const { type, action } = event;

  if (type === "action:start") {
    const s = spinner();

    activeSpinners.set(action.id, s);

    s.start(formatAction(action));
    return;
  }

  if (type === "action:complete") {
    const s = activeSpinners.get(action.id);

    if (s) {
      s.stop(`✓ ${formatAction(action)} completed`);
      activeSpinners.delete(action.id);
    }

    return;
  }

  if (type === "action:failed") {
    const s = activeSpinners.get(action.id);

    if (s) {
      s.stop(`✗ ${formatAction(action)} failed`);
      activeSpinners.delete(action.id);
    }
  }
}

function formatAction(action) {
  const { toolName, input } = action;

  switch (toolName) {
    case "list_files":
      return `Inspecting files: ${input.path || "."}`;

    case "read_file":
      return `Reading: ${input.path}`;

    case "write_file":
      return `Writing: ${input.path}`;

    case "run_command":
      return `Running: ${input.command}`;

    default:
      return `Running tool: ${toolName}`;
  }
}