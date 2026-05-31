import { prisma } from "../../lib/prisma";
import { ErrorResponse } from "../../utils/errorResponse";

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