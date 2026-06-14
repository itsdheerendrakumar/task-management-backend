import { prisma } from "../../lib/prisma";
import type { CreateActivityPayload } from "./activity.dtos";
export async function createActivity(data: CreateActivityPayload) {
    const activity = await prisma.activities.create({
        data,
    });
}

export async function getActivitiesRepository(userId: number, role: string, page: number, limit: number, filterId: number) {
   if (role === "admin") {
    const [activities, totalCount] = await Promise.all([
      prisma.activities.findMany({
        where: filterId ? { performed_by: filterId } : {},
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.activities.count(
        {
          where: filterId ? { performed_by: filterId } : {},
        }
      ),
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
    return await prisma.activities.findMany({
        where: { performed_by: userId },
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
    });
}