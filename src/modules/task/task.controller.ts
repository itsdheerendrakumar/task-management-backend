import type { NextFunction, Response } from "express"
import type { CustomRequest } from "../../utils/types"
import { successResponse } from "../../utils/response"
import { createTaskService, getTaskListingService, getTaskMetricsService, getLastOneYearTaskMonthWiseService} from "./task.service"
import type { GetTaskPayload } from "./task.dtos"

export async function createTask(req: CustomRequest, res: Response, next: NextFunction) {
  const userId = req.user?.user_id
  const userRole = req.user?.role
  const task = await createTaskService(req.body, userId!, userRole as "admin")
  return res.status(201).json(successResponse("Task created successfully", task))
}

export async function getTaskListing(req: GetTaskPayload, res: Response, next: NextFunction) {
  const {user_id} = req.user!;
  const {type} = req.query;
  const listing = await getTaskListingService(user_id, type);
  return res.status(200).json(successResponse("Task Listing found successfully", listing));
}

export async function getTaskMetrics(req: CustomRequest, res: Response, next: NextFunction) {
  const {user_id, role} = req.user!;
  const metrics = await getTaskMetricsService(user_id, role);
  return res.status(200).json(successResponse("Task Metrics found successfully", metrics));
}

export async function getLastOneYearTaskMonthWise(req: CustomRequest, res: Response, next: NextFunction) {
  const {user_id, role} = req.user!;
  const metrics = await getLastOneYearTaskMonthWiseService(user_id);
  return res.status(200).json(successResponse("Task Metrics found successfully", metrics));
}