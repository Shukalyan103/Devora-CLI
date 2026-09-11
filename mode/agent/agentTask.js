import {
    text,
    isCancel,
    cancel,
    spinner
} from "@clack/prompts";

import { runAgent } from "./agent.js";
import { renderTerminalMardown } from "../../tui/terminal_markdown.js";



export async function agentTask() {





    while (true) {
        const answer = await text({
            message: "What task you want to give Devora 🤖?",
            placeholder: "Describe the task for Devora",
        })


        if (isCancel(answer) || answer === "exit" || answer === "quit ") {

            cancel("Chat cancelled.");

            break;
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

            break;
        }


        const s = spinner();


        try {

            s.start(
                "Devora is working..."
            );


            const response = await runAgent(
                prompt,

            );


            s.stop(
                "Task completed!"
            );


            console.log(
                "\n🤖 Devora:\n"
            );


            console.log(
                renderTerminalMardown(response)
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