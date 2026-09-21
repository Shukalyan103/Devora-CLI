import {
    text,
    isCancel,
    cancel,
    spinner
} from "@clack/prompts";

import { runAgent } from "./agent.js";
import { renderTerminalMardown } from "../../tui/terminal_markdown.js";
import { logAction } from "../../actions/actionLogger.js";



export async function agentTask() {





    while (true) {
        const answer = await text({
            message: "What task you want to give Devora 🤖?",
            placeholder: "Describe the task for Devora",
        })


        if (isCancel(answer) || answer === "exit" || answer === "quit ") {

            cancel("Chat cancelled.");

           return
        }


        const prompt = answer.trim();


        if (!prompt) {
            continue;
        }


        if (
            prompt.toLowerCase() === "exit" ||
            prompt.toLowerCase() === "quit"
        ) {

            console.log(
                "\n👋 Goodbye!\n"
            );

            return
        }


        const s = spinner();


        try {

            s.start(
                "Devora is working..."
            );


            const response = await runAgent(
                prompt,
               {
                onAction: (event)=>{
                  logAction(event);
                }
               }

            );


            s.stop(
                "Task completed!"
            );


            console.log(
                "\n🤖 Devora:\n"
            );


            console.log(
                renderTerminalMardown(response.text)
            );





        } catch (error) {

            s.stop(
                "Task failed!"
            );

            console.error(
                "\n❌",
                error.message
            );
        }
    }
}