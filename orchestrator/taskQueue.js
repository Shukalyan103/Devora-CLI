export class TaskQueue {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  canRun(task) {
    return task.dependsOn.every(dependencyId => {
      const dependency =
        this.taskManager.getTask(dependencyId);

      return dependency?.status === "completed";
    });
  }

  getNextTask() {
    const pending =
      this.taskManager.getPendingTasks();

    return pending.find(task => this.canRun(task)) || null;
  }

  hasTasks() {
    return this.taskManager.getPendingTasks().length > 0;
  }
}