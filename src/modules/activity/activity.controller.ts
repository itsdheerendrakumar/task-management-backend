import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../../utils/types";
import { getActivitiesService } from "./activity.service";
import { successResponse } from "../../utils/response";
export async function getActivities(req: CustomRequest, res: Response, next: NextFunction) {
    const {page, limit, userId} = req.query;
    const {id, role} = req.user ?? {};
    const activities = await getActivitiesService(+id!, role!, +page!, +limit!, +userId);
    return res.status(200).json(successResponse("Activities fetched successfully", activities));
}