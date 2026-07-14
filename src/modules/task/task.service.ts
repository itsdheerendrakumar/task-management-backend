import type { UserRoles } from "../../utils/types"
import type { CreateTask, TaskStatus } from "./task.dtos"
import { createTaskRepository, TaskListingRepository, getTaskMetricsRepository, getLastOneYearTaskMonthWiseRepository} from "./task.repository"
import { createTaskSchema } from "./task.validation"
import { createActivity } from "../activity/activity.repository"
import { getActivityMessage } from "../activity/activity.utils"

export async function createTaskService(
  body: CreateTask,
  userId: number,
  creatorRole: "admin"
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

export async function getTaskListingService(user_id: number, status: TaskStatus) {
  const listing = await TaskListingRepository(user_id, status);
  return listing;
}

export async function getTaskMetricsService(user_id: number, role: UserRoles) {
  const metrics = await getTaskMetricsRepository(user_id, role);
  return metrics;
}

export async function getLastOneYearTaskMonthWiseService(user_id: number) {
  const metrics = await getLastOneYearTaskMonthWiseRepository(user_id);
  return metrics;
}
