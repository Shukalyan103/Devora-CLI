import {
  analyzeCodebase,
  createFile,
  createFolder,
  deleteFile,
  listFiles,
  readFile,
  searchFiles,
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
    ),

    create_file: trackTool(
      "create_file",
      createFile,
      tracker
    ),

    create_folder: trackTool(
      "create_folder",
      createFolder,
      tracker
    ),

    search_files: trackTool(
      "search_files",
      searchFiles,
      tracker
    ),
    analyze_codebase: trackTool(
      "analyze_codebase",
      analyzeCodebase,
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
    search_files: trackTool(
      "search_files",
      searchFiles,
      tracker
    ),
    analyze_codebase: trackTool(
      "analyze_codebase",
      analyzeCodebase,
      tracker
    )
  }
};