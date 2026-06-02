import z from "zod"
import type { createTaskSchema } from "./task.validation"
import { Interface } from "node:readline"
import type { CustomRequest } from "../../utils/types"

export type CreateTask = z.infer<typeof createTaskSchema>

export type TaskStatus = "pending" | "completed" | "both"

export interface GetTaskPayload extends CustomRequest {
    query: {
        type: TaskStatus
    }
}