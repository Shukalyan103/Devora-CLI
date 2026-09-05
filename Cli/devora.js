import { Command } from "commander";
import  {runCli } from "../tui/wakeup.js";





const program = new Command();


program
  .name("devora")
  .description("Devora CLI ")
  .version("1.0.0")
   .action(async () => {
       await runCli()
    })
  


  program
    .command("cli")
    .description("show the banner and pick cli or telegram mode")
    .action(async () => {
       await runCli()
    })



  await program.parseAsync(process.argv)