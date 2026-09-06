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

    if(isCancel(mode) || mode ==='exit'){
        console.log("Good bye.....")
        return
    }

    if(mode === 'ask'){
        startChat()
    }
    if(mode === 'agent'){
        console.log("Agent")

    }
    if(mode === 'planner'){
        console.log("Planner")

    }



}