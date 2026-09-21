import {
  generateText,
  stepCountIs
} from "ai";



import {
  Agenttools
} from "../../tools/index.js";


import {
  getAgentModel
} from "../../aiconfig/ai.js"
import { createActionTracker } from "../../actions/index.js";


const model = getAgentModel()

export async function runAgent(
  prompt,
  option
 
) {
   

  try {

    const tracker = createActionTracker();

    if(option.onAction){
      tracker.subscribe(option.onAction);
    }
    const tools = Agenttools(tracker)


    const result = await generateText({

      model,

      system: `
You are Devora, an intelligent CLI agent.

You can use tools to interact with
the user's current workspace.

Available abilities:

- Inspect files
- Read files
- Create files
- Modify files
- Run terminal commands

Rules:

1. Inspect the workspace before making changes.

2. Use list_files before assuming
   the project structure.

3. Read existing files before modifying them.

4. Use tools when information about
   the workspace is required.

5. Verify changes when possible.

6. Never access files outside
   the workspace.

7. Do not run destructive commands.

8. Clearly explain what you did.

      `,
      prompt,


      tools,

      stopWhen: stepCountIs(20)

    });

    return{
      text: result.text,
      actions: tracker.getActions()
    }

  } catch (error) {

    throw new Error(
      `Agent Error: ${error.message}`
    );
  }
}