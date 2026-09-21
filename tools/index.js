import {
  deleteFile,
  listFiles,
  readFile,
  writeFile
} from "./filesystem.js";


import {
  runCommand
} from "./terminal.js";
import { trackTool } from "../actions/trackTools.js";


export const Agenttools = (tracker) => {
  return {



    list_files: trackTool(
      "list_files",
      listFiles,
      tracker
    ),

    read_file: trackTool(
      "read_file",
      readFile,
      tracker
    ),

    write_file: trackTool(
      "write_file",
      writeFile,
      tracker
    ),

    run_command: trackTool(
      "run_command",
      runCommand,
      tracker
    ),

    delete_file: trackTool(
      "delete_file",
      deleteFile,
      tracker
    )
  }
};

export const Asktools = (tracker) => {
  return {
    list_files: trackTool(
      "list_files",
      listFiles,
      tracker
    ),

    read_file: trackTool(
      "read_file",
      readFile,
      tracker
    ),
  }
};