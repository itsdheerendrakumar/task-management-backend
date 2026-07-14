import type { UserRoles } from "../../utils/types";
import { getProfileRepository, getUserListingRepository, getUserSelectListingRepository, updateProfileRepository, getUserWithPasswordRepository, updatePasswordRepository } from "./user.repository";
import { uploadBufferToCloudinary } from "../../lib/cloudinary";
import cloudinary from "../../lib/cloudinary";
import { ErrorResponse } from "../../utils/errorResponse";
import { comparePassword } from "../../utils/comparePassword";
import { hashPassword } from "../../utils/hashPassword";
import { changePasswordSchema } from "./user.validation";
import { createActivity } from "../activity/activity.repository";
import { getActivityMessage } from "../activity/activity.utils";

export type ChangeProfilePayload = {
    profile_image?: string | null;
    file?: { buffer: Buffer; mimetype: string };
};

export type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
};

export async function getProfileService(userId: number) {
    const user = await getProfileRepository(userId);
    return user;
}

export async function getUserListingService() {
    const users = await getUserListingRepository();
    return users;
}

export async function getUserSelectListingService(roles: UserRoles[]) {
    const listing = await getUserSelectListingRepository(roles);
    return listing
}

export async function changeProfileService(userId: number | undefined | null, payload: ChangeProfilePayload) {

    const updates: { profile_image?: string | null } = {};

    if (payload.file) {
        const existing = await getProfileRepository(userId!);
        if (existing?.profile_image) {
            const url = existing.profile_image;
            const parts = url.split("/upload/");
            if (parts.length > 1) {
                let publicPart = parts[1] ?? "";
                publicPart = publicPart.replace(/v\d+\//, "");
                publicPart = publicPart.replace(/\.[^/.]+$/, "");
                await cloudinary.uploader.destroy(publicPart);
            }
        }

        const uploaded = await uploadBufferToCloudinary(payload.file.buffer, payload.file.mimetype, "taskManagement");
        updates.profile_image = uploaded.secure_url;
    } else if (payload.profile_image) {
        updates.profile_image = payload.profile_image;
    }

    if (!updates.profile_image) throw new ErrorResponse("No profile image to update", 400);

    const user = await updateProfileRepository(userId!, updates);
    createActivity({
        action: "user_updated",
        performed_by: userId!,
        message: getActivityMessage.user_updated(user.name ?? "")
    });
    return user;
}

export async function changePasswordService(userId: number | undefined | null, payload: ChangePasswordPayload) {
    const validatedPayload = changePasswordSchema.parse(payload);

    if (!userId) {
        throw new ErrorResponse("Unauthorized", 401);
    }

    const existingUser = await getUserWithPasswordRepository(userId);
    const isValidPassword = comparePassword(validatedPayload.currentPassword, existingUser.password);
    if (!isValidPassword) {
        throw new ErrorResponse("Current password is invalid", 400);
    }

    const hashedPassword = hashPassword(validatedPayload.newPassword);
    const user = await updatePasswordRepository(userId, hashedPassword);
    createActivity({
        action: "user_updated",
        performed_by: userId,
        message: getActivityMessage.user_updated(user.name ?? "")
    });
    return user;
}