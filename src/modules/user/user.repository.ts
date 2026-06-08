import { prisma } from "../../lib/prisma";
import { ErrorResponse } from "../../utils/errorResponse";
import type { UserRoles } from "../../utils/types";
import type { Prisma } from "../../../generated/prisma/client";

export async function getProfileRepository(userId: number) {
    const user = await prisma.user.findUnique({
        where: {
            id: +userId
        },
        select: {
            name: true,
            email: true,
            role: true,
            id: true,
            profile_image: true     
        }
    });
    if(!user) {
        throw new ErrorResponse("User not found", 400)
    }
    return user;
}

export async function getUserListingRepository() {
    const users = await prisma.user.findMany({
        where: {role: {not: "admin"}},
        select: {
            name: true,
            email: true,
            role: true,
            id: true,
            profile_image: true     
        }
    });
    return users;
}

export async function getUserSelectListingRepository(roles: UserRoles[]) {
    const listing = await prisma.user.findMany({
        where: {
            role: {
                in: roles
            }
        },
        select: {
            id: true,
            name: true,
            role: true
        }
    })
    return listing;
}

export async function getUserWithPasswordRepository(userId: number) {
    const user = await prisma.user.findUnique({
        where: { id: +userId },
        select: {
            id: true,
            password: true
        }
    });
    if (!user) {
        throw new ErrorResponse("User not found", 400);
    }
    return user;
}

export async function updatePasswordRepository(userId: number, password: string) {
    const user = await prisma.user.update({
        where: { id: +userId },
        data: { password },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profile_image: true
        }
    });
    return user;
}

export async function updateProfileRepository(userId: number, data: {name?: string | null; profile_image?: string | null}) {
        const updateData: Prisma.UserUpdateInput = {
            ...(typeof data.name !== "undefined" ? { name: data.name } : {}),
            ...(typeof data.profile_image !== "undefined" ? { profile_image: data.profile_image } : {})
        };

        const user = await prisma.user.update({
            where: { id: +userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profile_image: true
            }
        });
        return user;
}