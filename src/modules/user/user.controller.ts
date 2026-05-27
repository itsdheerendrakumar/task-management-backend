import type { NextFunction, Request, Response } from "express";
import { getProfileService, getUserListingService } from "./user.service";
import { successResponse } from "../../utils/response";
import type { CustomRequest } from "../../utils/types";

export async function getProfile(req: CustomRequest, res: Response, next: NextFunction) {
    const {user: decoded} = req;
    const user = await getProfileService(decoded?.user_id!);
    return res.status(200).json(successResponse("Profile found successfully", user));
}

export async function getUserListing(req: Request, res: Response, next: NextFunction) {
    const users = await getUserListingService();
    return res.status(200).json(successResponse("Users found successfully", users));
}