import type { UserRoles } from "../../utils/types.js"
import type { CreateTask, TaskStatus, UpdateTaskStatusPayload } from "./task.dtos.js"
import { createTaskRepository, TaskListingRepository, getTaskMetricsRepository, getLastOneYearTaskMonthWiseRepository, updateTaskStatusRepository } from "./task.repository.js"
import { createTaskSchema, updateTaskStatusSchema } from "./task.validation.js"
import { createActivity } from "../activity/activity.repository.js"
import { getActivityMessage } from "../activity/activity.utils.js"

export async function createTaskService(
  body: CreateTask,
  userId: string,
  creatorRole: "admin" | "projectManager" | "client" | "member"
) {
  const validatedData = createTaskSchema.parse(body)
  const task = await createTaskRepository(validatedData, userId, creatorRole)
  createActivity({
    action: "task_created",
    performed_by: userId,
    task_id: task?.id,
    message: getActivityMessage.task_created(validatedData.name),
  });
  return task
}

export async function updateTaskStatusService(taskId: string, userId: string, payload: UpdateTaskStatusPayload) {
  const validatedData = updateTaskStatusSchema.parse(payload)
  const { task, updatedTask } = await updateTaskStatusRepository(taskId, userId, validatedData)

  if (task.status !== validatedData.status) {
    createActivity({
      action: "task_status_changed",
      performed_by: userId,
      task_id: task.id,
      message: getActivityMessage.task_status_changed(task.name, task.status, validatedData.status),
    })
  }

  return updatedTask
}

export async function getTaskListingService(user_id: string, status: TaskStatus, role: UserRoles) {
  const listing = await TaskListingRepository(user_id, status, role);
  return listing;
}

export async function getTaskMetricsService(user_id: string, role: UserRoles) {
  const metrics = await getTaskMetricsRepository(user_id, role);
  return metrics;
}

export async function getLastOneYearTaskMonthWiseService(user_id: string) {
  const metrics = await getLastOneYearTaskMonthWiseRepository(user_id);
  return metrics;
}
