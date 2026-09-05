import chalk from "chalk";
import { runAgent } from "../aiconfig/ai.config.js";
import { renderTerminalMardown } from "../tui/terminal_markdown.js";
import { cancel, intro, isCancel, spinner, text } from "@clack/prompts";




export const normalAsk = async () => {
    let promt;

    let answer = await text({
        message: "what you want me to do",
        placeholder: "explain java script"
    })

    if (isCancel(answer) || answer.toLowerCase === "cancel") {
        cancel("Operation Canceled")
       return
    } else {


        promt = answer;

        let s = spinner();

        try {
            s.start("Devora is thinking ....")
            const response = await runAgent(promt)
            if (response) {
                s.stop(chalk.dim("Got It"))
                console.log(renderTerminalMardown(response))

            }

        } catch (err) {

            console.log(chalk.bgRed("Some Things went wrong"))
            console.log(err)
            
        }
    }
}