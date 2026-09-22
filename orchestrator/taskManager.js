import { randomUUID } from "node:crypto";

export class TaskManager {
  constructor() {
    this.tasks = [];
  }

  addTask({
    title,
    description,
    dependsOn = []
  }) {
    const task = {
      id: randomUUID(),
      title,
      description,
      dependsOn,
      status: "pending",
      attempts: 0,
      result: null,
      error: null,
      createdAt: new Date(),
      startedAt: null,
      completedAt: null
    };

    this.tasks.push(task);

    return task;
  }

  startTask(taskId) {
    const task = this.getTask(taskId);

    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    task.status = "running";
    task.attempts++;
    task.startedAt = new Date();

    return task;
  }

  completeTask(taskId, result = null) {
    const task = this.getTask(taskId);

    if (!task) return;

    task.status = "completed";
    task.result = result;
    task.completedAt = new Date();
  }

  failTask(taskId, error) {
    const task = this.getTask(taskId);

    if (!task) return;

    task.status = "failed";
    task.error = error?.message || String(error);
    task.completedAt = new Date();
  }

  getTask(taskId) {
    return this.tasks.find(task => task.id === taskId);
  }

  getTasks() {
    return this.tasks;
  }

  getPendingTasks() {
    return this.tasks.filter(
      task => task.status === "pending"
    );
  }

  getSummary() {
    return {
      total: this.tasks.length,
      pending: this.tasks.filter(t => t.status === "pending").length,
      running: this.tasks.filter(t => t.status === "running").length,
      completed: this.tasks.filter(t => t.status === "completed").length,
      failed: this.tasks.filter(t => t.status === "failed").length
    };
  }
}