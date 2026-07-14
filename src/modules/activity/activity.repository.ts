import { prisma } from "../../lib/prisma";
import type { CreateActivityPayload } from "./activity.dtos";
export async function createActivity(data: CreateActivityPayload) {
    const activity = await prisma.activities.create({
        data,
    });
    return activity;
}

export async function getActivitiesRepository(userId: number, role: string, page: number, limit: number, filterId?: number) {
    const userSelect = {
        select: {
            name: true,
            profile_image: true,
        },
    };

    if (role === "admin") {
        const where = filterId ? { performed_by: filterId } : {};
        const [activities, totalCount] = await Promise.all([
            prisma.activities.findMany({
                where,
                orderBy: { created_at: "desc" },
                skip: (page - 1) * limit,
                take: limit,
                include: { user: userSelect },
            }),
            prisma.activities.count({ where }),
        ]);

        return {
            data: activities,
            pagination: {
                page,
                limit,
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        };
    }

    const where = { performed_by: userId };
    const [activities, totalCount] = await Promise.all([
        prisma.activities.findMany({
            where,
            orderBy: { created_at: "desc" },
            skip: (page - 1) * limit,
            take: limit,
            include: { user: userSelect },
        }),
        prisma.activities.count({ where }),
    ]);

    return {
        data: activities,
        pagination: {
            page,
            limit,
            totalItems: totalCount,
            totalPages: Math.ceil(totalCount / limit),
        },
    };
}