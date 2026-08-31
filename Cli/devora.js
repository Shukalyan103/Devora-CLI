#!/usr/bin/env node

import "dotenv/config";
import readline from "node:readline"
import { runAgent } from "../aiconfig/ai.config.js";
import { banner, printBannerWithShadow } from "../tui/banner.js";
import figlet from "figlet";
import { cancel, intro,isCancel,spinner,text } from "@clack/prompts";
import chalk from "chalk";



banner();

const args = process.argv.slice(2)

let promt ;

if(args.length >0){
    promt = args.join(" ")
}else{
    

    let answer = await text({
      message:"what you want me to do",
      placeholder:"explain java script"
    })

    if(isCancel(answer)){
      cancel("Operation Canceled")
    }
    promt = answer;

    let s = spinner();

    try{
      s.start("Devora is thinking ....")
      const response = await runAgent(promt)
      if(response){
        s.stop(chalk.dim("Got It"))
        console.log(chalk.bgGray(response))

      }

    }catch(err){

      console.log(chalk.bgRed("Some Things went wrong"))
      console.log(err)
        process.exit(1)
    }
}


