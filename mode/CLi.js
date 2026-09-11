import { agentTask } from "./agent/agentTask.js";
import { startChat } from "./ask/ask.js";
import { isCancel, select } from "@clack/prompts";





export const cli= async()=>{

 const mode = await select({
        message:"which mode do you want to proceed with ?",
        options:[
            {value:'agent',label:"Agent"},
            {value:"ask",label:"Ask"},
            {value:"planner",label:"Planner"},
            {value:"exit",label:"Exit"}

        ]
    });
    //  how to intergrat judge0 with this project give me step by step guide

    if(isCancel(mode) || mode ==='exit'){
        console.log("Good bye.....")
        return
    }

    if(mode === 'ask'){
        startChat()
    }
    if(mode === 'agent'){
      agentTask()

    }
    if(mode === 'planner'){
        console.log("Planner")

    }



}