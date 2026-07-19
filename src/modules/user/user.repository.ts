import { User } from "../../models/User.js";
import { ErrorResponse } from "../../utils/errorResponse.js";
import type { UserRoles } from "../../utils/types.js";

export async function getProfileRepository(userId: string) {
    const user = await User.findById(userId).select('name email role profile_image');
    if(!user) {
        throw new ErrorResponse("User not found", 400);
    }
    return user;
}

export async function getUserListingRepository() {
    const users = await User.find({ role: { $ne: "admin" } }).select('name email role id profile_image');
    return users;
}

export async function getUserSelectListingRepository(roles: UserRoles[]) {
    const listing = await User.find({ role: { $in: roles } }).select('id name role');
    return listing;
}

export async function getUserWithPasswordRepository(userId: string) {
    const user = await User.findById(userId).select('password');
    if (!user) {
        throw new ErrorResponse("User not found", 400);
    }
    return user;
}

export async function updatePasswordRepository(userId: string, password: string) {
    const user = await User.findByIdAndUpdate(
        userId,
        { password },
        { new: true }
    ).select('name email role profile_image');
    if (!user) {
        throw new ErrorResponse("User not found", 400);
    }
    return user;
}

export async function updateProfileRepository(userId: string, data: {name?: string | null; profile_image?: string | null}) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.profile_image !== undefined) updateData.profile_image = data.profile_image;

    const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
    ).select('name email role profile_image');
    if (!user) {
        throw new ErrorResponse("User not found", 400);
    }
    return user;
}