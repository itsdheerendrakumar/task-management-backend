import { prisma } from "../../lib/prisma.js"
import type { UserRoles } from "../../utils/types.js"
import type { CreateTask, TaskMetrics, TaskStatus } from "./task.dtos"

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

export async function getTaskMetricsRepository(user_id: number, role: UserRoles) {
  const metrics: TaskMetrics[] = await prisma.$queryRaw`
    SELECT 
    COUNT(*) AS totalTask,
    COUNT(*) FILTER (WHERE status='pending') AS "pendingTask",
    COUNT(*) FILTER (WHERE status='completed') AS "completedTask",
    COUNT(*) FILTER (WHERE deadline<NOW() AND status='pending') AS "overedueTask"
    FROM "Task"
  `
  const metricsObj = metrics?.[0] ?? {
    totalTask: 0,
    pendingTask: 0,
    completedTask: 0,
    overedueTask: 0
  }
  for(const key in metricsObj) {
    const typedKey = key as keyof typeof metricsObj
    metricsObj[typedKey] = Number(metricsObj[typedKey])
  }
  return metricsObj;
}

export async function getLastOneYearTaskMonthWiseRepository(user_id: number) {
  const metrics = await prisma.$queryRaw`
    WITH months AS (
      SELECT generate_series(
        date_trunc('month', NOW()) - INTERVAL '11 month',
        date_trunc('month', NOW()),
        INTERVAL '1 month'
      ) AS month_start
    )
    SELECT
      TO_CHAR(months.month_start, 'Mon-YYYY') AS month,
      COALESCE(created.count, 0) AS created_tasks,
      COALESCE(completed.count, 0) AS completed_tasks
    FROM months
    LEFT JOIN (
      SELECT date_trunc('month', t.created_at) AS mth, COUNT(*) AS count
      FROM "Task" t
      JOIN "TaskParticipants" tp ON tp.task_id = t.id
      WHERE tp.user_id = ${user_id}
      GROUP BY mth
    ) created ON created.mth = months.month_start
    LEFT JOIN (
      SELECT date_trunc('month', t.updated_at) AS mth, COUNT(*) AS count
      FROM "Task" t
      JOIN "TaskParticipants" tp ON tp.task_id = t.id
      WHERE tp.user_id = ${user_id} AND t.status = 'completed'
      GROUP BY mth
    ) completed ON completed.mth = months.month_start
    ORDER BY months.month_start
  `
  return metrics;
}