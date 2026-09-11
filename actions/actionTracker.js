import { randomUUID } from "node:crypto";

export class ActionTracker {

  constructor() {
    this.actions = [];
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners =
        this.listeners.filter(
          item => item !== listener
        );
    };
  }

  emit(action) {
    for (const listener of this.listeners) {
      listener(action);
    }
  }

  start({
    toolName,
    input
  }) {

    const action = {
      id: randomUUID(),

      toolName,

      input,

      status: "running",

      startedAt: new Date(),

      completedAt: null,

      error: null
    };

    this.actions.push(action);

    this.emit({
      type: "action:start",
      action
    });

    return action.id;
  }


  complete(actionId, output) {

    const action =
      this.actions.find(
        action => action.id === actionId
      );

    if (!action) return;

    action.status = "completed";

    action.output = output;

    action.completedAt = new Date();

    this.emit({
      type: "action:complete",
      action
    });
  }


  fail(actionId, error) {

    const action =
      this.actions.find(
        action => action.id === actionId
      );

    if (!action) return;

    action.status = "failed";

    action.error =
      error.message || String(error);

    action.completedAt = new Date();

    this.emit({
      type: "action:failed",
      action
    });
  }


  getActions() {
    return this.actions;
  }

}