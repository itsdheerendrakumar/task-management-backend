import { prisma } from "../../lib/prisma.js"
import type { UserRoles } from "../../utils/types.js"
import type { CreateTask, TaskStatus } from "./task.dtos"

export async function createTaskRepository(
  taskData: CreateTask,
  userId: number,
  creatorRole: "admin"
) {
  const task = await prisma.task.create({
    data: {
      name: taskData.name,
      description: taskData.description,
      deadline: taskData.deadline,
      notes: taskData.notes,
      created_by: userId,
      status: "pending",
    },
  })

  const participants = taskData.participants.map((participant) => ({
    user_id: participant.user_id,
    role: participant.user_id === userId ? creatorRole : participant.role,
  }))

  if (!participants.some((participant) => participant.user_id === userId)) {
    participants.unshift({
      user_id: userId,
      role: creatorRole,
    })
  }

  if (participants.length > 0) {
    await prisma.taskParticipants.createMany({
      data: participants.map((participant) => ({
        task_id: task.id,
        user_id: participant.user_id,
        role: participant.role,
      })),
      skipDuplicates: true,
    })
  }

  return prisma.task.findUnique({
    where: { id: task.id },
    include: { task_participants: true },
  })
}

export async function TaskListingRepository(user_id: number, status: TaskStatus) {
  const listing = await prisma.task.findMany({
    where: {
      task_participants: {
        some: {
          user_id: user_id,
        }
      },
      status: status === "both" ? { in: ["pending", "completed"] } : status,
      },
    include: {
      task_participants: {
        include: {
          user: {
            omit: {
              password: true,
            }
          },
          task_id: false,
          user_id: false,
          role: false,
        }
      },
    },
  });
  return listing;
}