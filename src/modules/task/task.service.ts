import type { UserRoles } from "../../utils/types"
import type { CreateTask, TaskStatus } from "./task.dtos"
import { createTaskRepository, TaskListingRepository } from "./task.repository"
import { createTaskSchema } from "./task.validation"

export async function createTaskService(
  body: CreateTask,
  userId: number,
  creatorRole: "admin"
) {
  const validatedData = createTaskSchema.parse(body)
  const task = await createTaskRepository(validatedData, userId, creatorRole)
  return task
}

export async function getTaskListingService(user_id: number, status: TaskStatus) {
  const listing = await TaskListingRepository(user_id, status);
  return listing;
}
