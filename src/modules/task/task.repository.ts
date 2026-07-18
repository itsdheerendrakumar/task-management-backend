import { Task } from "../../models/Task.js";
import type { UserRoles } from "../../utils/types.js";
import type { CreateTask, TaskStatus, UpdateTaskStatus } from "./task.dtos";

export async function createTaskRepository(
  taskData: CreateTask,
  userId: string,
  creatorRole: "admin" | "projectManager" | "client" | "member"
) {
  const participants = taskData.participants.map((participant) => ({
    user: participant.user_id,
    role: participant.user_id === userId ? creatorRole : participant.role,
  }));

  if (!participants.some((participant) => participant.user.toString() === userId)) {
    participants.unshift({
      user: userId,
      role: creatorRole,
    });
  }

  const task = await Task.create({
    name: taskData.name,
    description: taskData.description,
    deadline: new Date(taskData.deadline),
    notes: taskData.notes,
    created_by: userId,
    status: "pending",
    task_participants: participants,
  });

  const populatedTask = await Task.findById(task._id).populate({
    path: 'task_participants.user',
    select: '-password'
  });

  return populatedTask;
}

export async function updateTaskStatusRepository(taskId: string, userId: string, payload: UpdateTaskStatus) {
  const task = await Task.findOne({
    _id: taskId,
    $or: [
      { created_by: userId },
      { "task_participants.user": userId }
    ]
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const originalTask = {
    id: task.id,
    name: task.name,
    status: task.status
  };

  task.status = payload.status as any;
  const updatedTask = await task.save();

  return { task: originalTask, updatedTask };
}

export async function TaskListingRepository(user_id: string, status: TaskStatus, role: UserRoles) {
  let statusFilter: any;
  if (status === "both") {
    statusFilter = { $in: ["pending", "in-progress", "completed"] };
  } else {
    statusFilter = status;
  }

  const query: any = { status: statusFilter };

  if (role !== "admin") {
    query["task_participants.user"] = user_id;
  }

  const listing = await Task.find(query)
    .populate({
      path: "task_participants.user",
      select: "-password"
    });

  return listing;
}

export async function getTaskMetricsRepository(user_id: string, role: UserRoles) {
  const query: any = {};
  if (role !== "admin") {
    query["task_participants.user"] = user_id;
  }

  const now = new Date();

  const totalTask = await Task.countDocuments(query);
  const pendingTask = await Task.countDocuments({ ...query, status: "pending" });
  const inProgressTask = await Task.countDocuments({ ...query, status: "in-progress" });
  const completedTask = await Task.countDocuments({ ...query, status: "completed" });
  const overedueTask = await Task.countDocuments({
    ...query,
    deadline: { $lt: now },
    status: { $in: ["pending", "in-progress"] }
  });

  return {
    totaltask: totalTask,
    pendingTask,
    inProgressTask,
    completedTask,
    overedueTask
  };
}

export async function getLastOneYearTaskMonthWiseRepository(user_id: string) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 11);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const tasks = await Task.find({
    $or: [
      { created_by: user_id },
      { "task_participants.user": user_id }
    ]
  });

  const monthlyData: any[] = [];
  const temp = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(temp.getFullYear(), temp.getMonth() - i, 1);
    const monthStr = d.toLocaleDateString('en-US', { month: 'short' }) + '-' + d.getFullYear(); // e.g. Jul-2026
    monthlyData.push({
      month: monthStr,
      year: d.getFullYear(),
      monthNum: d.getMonth(),
      created_tasks: 0,
      completed_tasks: 0
    });
  }

  for (const task of tasks) {
    const createdAt = new Date(task.created_at!);
    const updatedAt = new Date(task.updated_at!);

    if (createdAt >= startDate) {
      const match = monthlyData.find(m => m.year === createdAt.getFullYear() && m.monthNum === createdAt.getMonth());
      if (match) {
        match.created_tasks++;
      }
    }

    if (task.status === "completed" && updatedAt >= startDate) {
      const match = monthlyData.find(m => m.year === updatedAt.getFullYear() && m.monthNum === updatedAt.getMonth());
      if (match) {
        match.completed_tasks++;
      }
    }
  }

  return monthlyData.map(m => ({
    month: m.month,
    created_tasks: String(m.created_tasks),
    completed_tasks: String(m.completed_tasks)
  }));
}