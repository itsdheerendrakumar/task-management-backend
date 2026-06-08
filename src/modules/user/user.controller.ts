import type { NextFunction, Response, Request } from "express";
import { getProfileService, getUserListingService, getUserSelectListingService, changeProfileService, changePasswordService, type ChangeProfilePayload, type ChangePasswordPayload } from "./user.service";
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

export async function changeProfile(req: CustomRequest, res: Response, next: NextFunction) {
    const { user: decoded } = req;
    const payload: ChangeProfilePayload = {};
    if (req.file) {
        const file = req.file as Express.Multer.File;
        if (file.buffer) payload.file = { buffer: file.buffer, mimetype: file.mimetype };
    }

    const user = await changeProfileService(decoded?.user_id, payload);
    return res.status(201).json(successResponse("Profile detail updated successfully", user));
}

export async function changePassword(req: CustomRequest, res: Response, next: NextFunction) {
    const { user: decoded } = req;
    const payload = req.body as ChangePasswordPayload;
    await changePasswordService(decoded?.user_id, payload);
    return res.status(200).json(successResponse("Password changed successfully"));
}