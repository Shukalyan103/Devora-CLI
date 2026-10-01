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

            let summaryMarkdown = `### 📋 Execution Summary\n\n`;
            summaryMarkdown += `- **Total Tasks:** ${result.summary?.total ?? result.tasks.length}\n`;
            summaryMarkdown += `- **Completed:** ${result.summary?.completed ?? 0}\n`;
            summaryMarkdown += `- **Failed:** ${result.summary?.failed ?? 0}\n\n`;

            for (const task of result.tasks) {

                const icon = task.status === "completed" ? "✓" : "✗";

                summaryMarkdown += `#### ${icon} ${task.title}\n`;

                if (task.result?.actions?.length) {
                    summaryMarkdown += `**Actions Taken:**\n`;
                    task.result.actions.forEach(act => {
                        const detail = act.input?.path || act.input?.command || "";
                        summaryMarkdown += `- \`${act.toolName}\` ${detail ? `(${detail})` : ""}\n`;
                    });
                    summaryMarkdown += `\n`;
                }
                // AI's conclusion / response text
                if (task.result?.text) {
                    summaryMarkdown += `**Result:**\n${task.result.text.trim()}\n\n`;
                }
                if (task.error) {
                    summaryMarkdown += `**Error:** ${task.error}\n\n`;
                }

            }


            console.log(
                renderTerminalMardown(summaryMarkdown)
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