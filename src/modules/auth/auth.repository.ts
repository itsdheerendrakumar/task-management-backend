import { prisma } from "../../lib/prisma";

export async function findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    return user;
}

export async function storeSession(userId: number, token: string, family_id: string, id: string) {
    await prisma.session.create({
        data: {
            id,
            user_id: userId,
            refresh_token: token,
            family_id,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });
}