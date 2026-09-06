import {
  listFiles,
  readFile,
  writeFile
} from "./filesystem.js";

import {
  runCommand
} from "./terminal.js";


export const tools = {

  list_files: listFiles,

  read_file: readFile,

  write_file: writeFile,

  run_command: runCommand

};