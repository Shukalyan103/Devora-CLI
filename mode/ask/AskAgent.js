import {
  generateText,
  stepCountIs
} from "ai";



import {
Asktools
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

    const tools = Asktools(tracker);

    const result = await generateText({

      model,

      system: `
You are Devora, a read-only AI agent.

You can inspect the user's workspace using tools.

Available tools:

- list_files
- read_file

You MUST NOT claim that you modified files or executed commands.

You cannot:

- Create files
- Modify files
- Delete files
- Execute terminal commands

Use list_files and read_file to inspect the workspace before answering questions about the project.

      `,
      prompt,


      tools,

      stopWhen: stepCountIs(20)

    });

    return { 
      text: result.text ,
       actions: tracker.getActions()
     };

  } catch (error) {

    throw new Error(
      `Agent Error: ${error.message}`
    );
  }
}