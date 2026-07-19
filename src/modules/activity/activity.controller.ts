import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../../utils/types.js";
import { getActivitiesService } from "./activity.service.js";
import { successResponse } from "../../utils/response.js";
export async function getActivities(req: CustomRequest, res: Response, next: NextFunction) {
    const {page, limit, userId} = req.query;
    const {user_id, role} = req.user ?? {};
    const activities = await getActivitiesService(user_id!, role!, +page!, +limit!, userId ? String(userId) : undefined);
    return res.status(200).json(successResponse("Activities fetched successfully", activities));
}