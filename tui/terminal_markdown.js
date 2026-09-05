import { marked } from "marked";
import{markedTerminal} from "marked-terminal"

let ready = false


function ensureMarked() {
  if (ready) return;
  const w = Math.max(40, Math.min(process.stdout.columns || 80, 120));

  marked.use(markedTerminal({ width: w, reflowText: true }, {}));
  ready = true;
}

export function renderTerminalMardown(source){
    ensureMarked();
    return marked.parse(source.trimEnd(),{async:false})
}