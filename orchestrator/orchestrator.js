
import { TaskManager } from "./taskManager.js";
import { TaskQueue } from "./taskQueue.js";
import { createPlan } from "./planner.js";
import { executeTask } from "./executor.js";

import { MemoryManager } from "../memory/MemoryManager.js";

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
  // 1. Initialize memory
  // -------------------------

  const memoryManager = new MemoryManager();

  await memoryManager.initialize();

  memoryManager.session.setGoal(prompt);

  // -------------------------
  // 2. Create plan
  // -------------------------

  const plan = await createPlan(prompt);

  if (!plan?.tasks?.length) {
    throw new Error(
      "Planner returned no tasks."
    );
  }

  // -------------------------
  // 3. Create tasks
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

  onPlan?.(
    taskManager.getTasks()
  );

  // -------------------------
  // 4. Create queue
  // -------------------------

  const queue = new TaskQueue(
    taskManager
  );

  // -------------------------
  // 5. Execute tasks
  // -------------------------

  const completedTasks = [];

  while (queue.hasTasks()) {
    const task =
      queue.getNextTask();

    if (!task) {
      throw new Error(
        "Task queue is blocked. Check task dependencies."
      );
    }

    taskManager.startTask(
      task.id
    );

    memoryManager.session.setCurrentTask(
      task
    );

    onTaskStart?.(task);

    try {
      const result =
        await executeTask(task, {
          onAction,
          memoryManager,
          goal: prompt,
          completedTasks
        });

      taskManager.completeTask(
        task.id,
        result
      );

      const rawText = typeof result?.text === "string" ? result.text.trim() : "";
      const firstLine = rawText.split("\n")[0] || "Completed successfully";
      const shortSummary = firstLine.length > 150 ? firstLine.slice(0, 147) + "..." : firstLine;

      completedTasks.push({
        title: task.title,
        summary: shortSummary
      });
      
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

  // -------------------------
  // 6. Return final result
  // -------------------------

  return {
    tasks: taskManager.getTasks(),
    summary: taskManager.getSummary(),

    memory: {
      project:
        memoryManager.getProjectMemory(),

      global:
        memoryManager.getGlobalMemory(),

      session:
        memoryManager.getSessionMemory()
    }
  };
}
