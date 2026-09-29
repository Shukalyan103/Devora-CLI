import { buildContext } from "../memory/contextBuilder.js";
import { extractMemory } from "../memory/memoryExtractor.js";
import { runAgent } from "../mode/agent/agent.js";
 
export async function executeTask(
  task,
  {
    onAction,
    memoryManager,    
    goal,
    completedTasks = []
  } = {}
) {
  if(!memoryManager) {
    throw new Error("Memory manager is required");
  }


  const prompt = buildContext({
    goal,
    task,
    projectMemory:memoryManager.getProjectMemory(),
      
    globalMemory:memoryManager.getGlobalMemory(),
      
    sessionMemory:memoryManager.getSessionMemory(),
     completedTasks
  });



 const result = await runAgent(prompt, {
    onAction
  });


  const extractedMemory =
    await extractMemory(
      task,
      result.text
    );

  await memoryManager
    .saveExtractedMemory(
      extractedMemory
    );

  return result;
}












//   const prompt = `
// You are executing one task as part of a larger Devora plan.

// Task:
// ${task.title}

// Description:
// ${task.description}

// Instructions:
// - Inspect the workspace when necessary.
// - Use the available tools.
// - Actually perform the required work.
// - Explain what should be done.
// - Report what you changed or verified.
// `;