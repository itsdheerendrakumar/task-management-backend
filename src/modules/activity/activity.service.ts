import { getActivitiesRepository } from "./activity.repository";

export async function getActivitiesService(userId: number, role: string, page: number, limit: number, filterId?: number) {
    const activities = await getActivitiesRepository(userId, role, page, limit, filterId);
    return activities;
}