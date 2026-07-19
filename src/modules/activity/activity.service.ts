import { getActivitiesRepository } from "./activity.repository.js";

export async function getActivitiesService(userId: string, role: string, page: number, limit: number, filterId?: string) {
    const activities = await getActivitiesRepository(userId, role, page, limit, filterId);
    return activities;
}