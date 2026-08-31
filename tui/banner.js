
import chalk from "chalk";
import figlet from "figlet";


const BANNER_FONT='ANSI Shadow';
const SHADOW=chalk.hex('#5b4d9e');
const FACE= chalk.hex('#e8dcf8').bold;



export function printBannerWithShadow(ascii) {

  const bannerLines = ascii.replace(/\s+$/, '').split('\n');
  const maxLen = Math.max(...bannerLines.map((l) => l.length), 0);
  const rowWidth = maxLen + 2;

  for (const line of bannerLines) {
    console.log(SHADOW(('  ' + line).padEnd(rowWidth)));
  }
  process.stdout.write(`\x1b[${bannerLines.length}A`);
  for (const line of bannerLines) {
    console.log(FACE(line.padEnd(rowWidth)));
  }
  console.log();
}

export const banner=()=>{

    let ascii;
      try{
            ascii = figlet.textSync("devora Cli",{font : BANNER_FONT})
        }catch(error){
            ascii = figlet.textSync("devora Cli",{font:'Standard'})
        }
        printBannerWithShadow(ascii)
} 




  
