import type { NextFunction, Request, Response } from "express";
import { getProfileService, getUserListingService, getUserSelectListingService } from "./user.service";
import { successResponse } from "../../utils/response";
import type { CustomRequest, UserRoles } from "../../utils/types";

export async function getProfile(req: CustomRequest, res: Response, next: NextFunction) {
    const {user: decoded} = req;
    const user = await getProfileService(decoded?.user_id!);
    return res.status(200).json(successResponse("Profile found successfully", user));
}

export async function getUserListing(req: Request, res: Response, next: NextFunction) {
    const users = await getUserListingService();
    return res.status(200).json(successResponse("Users found successfully", users));
}

export async function getUserSelectListing(req: Request, res: Response, next: NextFunction) {
    const {roles} = req.query;
    const listing = await getUserSelectListingService((roles as string)?.split(",") as UserRoles[] ?? []);
    return res.status(200).json(successResponse("Listing found successfully", listing));
}