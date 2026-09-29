import {
  loadProjectMemory,
  saveProjectMemory
} from "./projectMemory.js";

import {
  loadGlobalMemory,
  saveGlobalMemory
} from "./globalMemory.js";

import { SessionMemory } from "./sessionMemory.js";

export class MemoryManager {
  constructor() {
    this.project = null;
    this.global = null;
    this.session = new SessionMemory();
  }

  async initialize() {
     this.project = await loadProjectMemory(); 
     this.global = await loadGlobalMemory(); 
     
    this.project = { project: {}, decisions: [], importantFiles: [], notes: [], ...this.project };

   this.global = { preferences: [], notes: [], ...this.global };
  }

  getProjectMemory() {
    return this.project;
  }

  getGlobalMemory() {
    return this.global;
  }

  getSessionMemory() {
    return this.session.get();
  }

  async addProjectDecision(decision) {
    this.project.decisions.push(decision);

    await saveProjectMemory(
      this.project
    );
  }

  async addProjectNote(note) {
    this.project.notes.push(note);

    await saveProjectMemory(
      this.project
    );
  }

  async addImportantFile(file) {
    if (!this.project.importantFiles.includes(file)  )
   {
      this.project.importantFiles.push(file);
    }

    await saveProjectMemory(
      this.project
    );
  }

  async addGlobalPreference(preference) {
    this.global.preferences.push(
      preference
    );

    await saveGlobalMemory(
      this.global
    );
  }

  async addGlobalNote(note) {
    this.global.notes.push(note);

    await saveGlobalMemory(
      this.global
    );
  }

  async saveExtractedMemory(memory) {
  for (const decision of memory.decisions) {
    await this.addProjectDecision(
      decision
    );
  }

  for (const file of memory.importantFiles) {
    await this.addImportantFile(
      file
    );
  }

  for (const note of memory.notes) {
    await this.addProjectNote(
      note
    );
  }
}
}