import { z } from "zod"

const participantSchema = z.object({
  user_id: z.string().min(1, "User ID is required"),
  role: z.enum(["admin", "projectManager", "client", "member"]),
})

export const createTaskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Task description is required"),
  deadline: z.string()
    .length(24, "Deadline is required"),
  notes: z.string().optional().default(""),
  participants: z.array(participantSchema).optional().default([]),
})

export const updateTaskStatusSchema = z.object({
  status: z.enum(["pending", "in-progress", "completed"]),
})

export type CreateTask = z.infer<typeof createTaskSchema>
