import { Activity } from "../../models/Activity.js";
import type { CreateActivityPayload } from "./activity.dtos";

export async function createActivity(data: CreateActivityPayload) {
    const activity = await Activity.create({
        action: data.action,
        message: data.message,
        task_id: data.task_id ? String(data.task_id) : undefined,
        subtask_id: data.subtask_id ? String(data.subtask_id) : undefined,
        meta_data: data.meta_data,
        performed_by: data.performed_by
    });
    return activity;
}

export async function getActivitiesRepository(userId: string, role: string, page: number, limit: number, filterId?: string) {
    const userSelect = 'name profile_image';
    const skip = (page - 1) * limit;

    let where: any = {};
    if (role === "admin") {
        if (filterId) {
            where.performed_by = filterId;
        }
    } else {
        where.performed_by = userId;
    }

    const [activities, totalCount] = await Promise.all([
        Activity.find(where)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)
            .populate('performed_by', userSelect),
        Activity.countDocuments(where)
    ]);

    const mappedActivities = activities.map(act => {
        const actObj = act.toJSON() as any;
        actObj.user = actObj.performed_by;
        return actObj;
    });

    return {
        data: mappedActivities,
        pagination: {
            page,
            limit,
            totalItems: totalCount,
            totalPages: Math.ceil(totalCount / limit),
        },
    };
}