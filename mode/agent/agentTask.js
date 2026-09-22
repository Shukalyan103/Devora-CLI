import {
    text,
    isCancel,
    cancel,
    spinner
} from "@clack/prompts";

import { runAgent } from "./agent.js";
import { renderTerminalMardown } from "../../tui/terminal_markdown.js";
import { logAction } from "../../actions/actionLogger.js";
import { runOrchestrator } from "../../orchestrator/orchestrator.js";



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

            // s.start(
            //     "Devora is working..."
            // );


            // const response = await runAgent(
            //     prompt,
            //    {
            //     onAction: (event)=>{
            //       logAction(event);
            //     }
            //    }

            // );

            const result = await runOrchestrator(
                prompt,
                {
                    onPlan(tasks) {
                        s.stop("Plan created");

                        console.log("\n📋 Plan\n");

                        tasks.forEach((task, index) => {
                            console.log(
                                `  ${index + 1}. ${task.title}`
                            );
                        });

                        console.log();
                    },

                    onTaskStart(task) {
                        console.log(
                            `▶ ${task.title}`
                        );
                    },

                    onTaskComplete(task) {
                        console.log(
                            `✓ ${task.title}\n`
                        );
                    },

                    onTaskFailed(task, error) {
                        console.log(
                            `✗ ${task.title}`
                        );

                        console.log(
                            `  ${error.message}\n`
                        );
                    },

                    onAction(actionEvent) {
                        {
                            logAction(actionEvent);

                        }
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