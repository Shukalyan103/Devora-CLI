import { TaskManager } from "./taskManager.js";
import { TaskQueue } from "./taskQueue.js";
import { createPlan } from "./planner.js";
import { executeTask } from "./executor.js";

export async function runOrchestrator(
  prompt,
  {
    onPlan,
    onTaskStart,
    onTaskComplete,
    onTaskFailed,
    onAction
  } = {}
) {
  const taskManager = new TaskManager();

  // -------------------------
  // 1. Create plan
  // -------------------------

  const plan = await createPlan(prompt);

  if (!plan?.tasks?.length) {
    throw new Error("Planner returned no tasks.");
  }

  // -------------------------
  // 2. Create tasks
  // -------------------------

  let previousTaskId = null;

  for (const plannedTask of plan.tasks) {
    const task = taskManager.addTask({
      title: plannedTask.title,
      description: plannedTask.description,
      dependsOn: previousTaskId
        ? [previousTaskId]
        : []
    });

    previousTaskId = task.id;
  }

  onPlan?.(taskManager.getTasks());

  // -------------------------
  // 3. Create queue
  // -------------------------

  const queue = new TaskQueue(taskManager);

  // -------------------------
  // 4. Execute tasks
  // -------------------------

  while (queue.hasTasks()) {
    const task = queue.getNextTask();

    if (!task) {
      throw new Error(
        "Task queue is blocked. Check task dependencies."
      );
    }

    taskManager.startTask(task.id);

    onTaskStart?.(task);

    try {
      const result = await executeTask(task, {
        onAction
      });

      taskManager.completeTask(
        task.id,
        result
      );

      onTaskComplete?.(
        task,
        result
      );

    } catch (error) {
      taskManager.failTask(
        task.id,
        error
      );

      onTaskFailed?.(
        task,
        error
      );

      throw error;
    }
  }

  return {
    tasks: taskManager.getTasks(),
    summary: taskManager.getSummary()
  };
}