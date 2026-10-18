import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../../utils/types.js";
import { getActivitiesService, deleteActivitiesService } from "./activity.service.js";
import { successResponse } from "../../utils/response.js";
export async function getActivities(req: CustomRequest, res: Response, next: NextFunction) {
    const {page, limit, userId} = req.query;
    const {user_id, role} = req.user ?? {};
    const activities = await getActivitiesService(user_id!, role!, +page!, +limit!, userId ? String(userId) : undefined);
    return res.status(200).json(successResponse("Activities fetched successfully", activities));
}

export async function deleteActivities(req: CustomRequest, res: Response, next: NextFunction) {
    const {user_id, role} = req.user ?? {};
    const activityIds = req.query.activityIds;
    await deleteActivitiesService(user_id!, role!, activityIds as string[]);
    return res.status(200).json(successResponse("Activities deleted successfully"));
}