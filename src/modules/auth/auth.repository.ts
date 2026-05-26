import { prisma } from "../../lib/prisma";
import { ErrorResponse } from "../../utils/errorResponse";
import {type RegisterUser} from "./auth.dtos"

export async function findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    return user;
}

export async function storeSession(userId: number, token: string, id: string) {
    await prisma.session.create({
        data: {
            id,
            user_id: userId,
            refresh_token: token,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });
}

export async function findSessionById(id: string) {
    const session = await prisma.session.findUnique({
        where: {
            id
        }
    });
    return session;
}

export async function deleteSessionById(id: string) {
    await prisma.session.delete({
        where: {
            id
        }
    });
}

export async function updateSession(id: string, refreshToken: string, remainingDuration: number) {
    const session = await prisma.session.update({
        where: {
            id
        },
        data: {
            refresh_token: refreshToken,
            expires_at: new Date(Date.now() + remainingDuration)
        }
    })
}

export async function creeateNewUser(body: RegisterUser) {
    const user = await prisma.user.create({
        data: body,
        omit: {
            password: true
        }
    });
    return user;
}