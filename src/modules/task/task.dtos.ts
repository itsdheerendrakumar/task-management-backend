import z from "zod"
import type { createTaskSchema, updateTaskStatusSchema } from "./task.validation.js"
import type { CustomRequest } from "../../utils/types.js"

export type CreateTask = z.infer<typeof createTaskSchema>
export type UpdateTaskStatus = z.infer<typeof updateTaskStatusSchema>

export type TaskStatus = "pending" | "in-progress" | "completed" | "both"

export interface GetTaskPayload extends CustomRequest {
    query: {
        type?: TaskStatus
    }
}

export interface UpdateTaskStatusPayload {
    status: "pending" | "in-progress" | "completed"
}

export interface TaskMetrics {
    totaltask: number
    pendingTask: number
    inProgressTask: number
    completedTask: number
    overedueTask: number
}