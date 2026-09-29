export class SessionMemory {
  constructor() {
    this.data = {
      goal: null,
      completedTasks: [],
      currentTask: null
    };
  }

  setGoal(goal) {
    this.data.goal = goal;
  }

  setCurrentTask(task) {
    this.data.currentTask = task;
  }

  addCompletedTask(task) {
    this.data.completedTasks.push(task);
  }

  get() {
    return this.data;
  }

  clear() {
    this.data = {
      goal: null,
      completedTasks: [],
      currentTask: null
    };
  }
}