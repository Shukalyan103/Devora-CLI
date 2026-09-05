
import "dotenv/config";
import { banner, printBannerWithShadow } from "./banner.js";
import chalk from "chalk";
import { isCancel, select } from "@clack/prompts";
import { normalAsk } from "../chat/normalAsk.js";


export async function runCli() {
    

banner();

// option 

 const mode = await select({
        message:"which mode do you want to proceed with ?",
        options:[
            {value:'cli',label:"CLI"},
            {value:"chat",label:"Chat"},
            {value:"exit",label:"Exit"}

        ]
    });

    if(isCancel(mode) || mode ==='exit'){
        console.log("Good bye.....")
        return
    }

    if(mode === 'cli'){
        console.log("cli")
    }
    if(mode === 'chat'){
       normalAsk()
    }


    


}

