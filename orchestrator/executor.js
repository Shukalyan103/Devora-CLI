import { runAgent } from "../mode/agent/agent.js";
 
export async function executeTask(
  task,
  {
    
    onAction
  } = {}
) {
  const prompt = `
You are executing one task as part of a larger Devora plan.

Task:
${task.title}

Description:
${task.description}

Instructions:
- Inspect the workspace when necessary.
- Use the available tools.
- Actually perform the required work.
- Do not just explain what should be done.
- Report what you changed or verified.
`;

  return await runAgent(prompt, {
    onAction
  });
}