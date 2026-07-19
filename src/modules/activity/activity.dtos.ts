export interface CreateActivityPayload {
    action: "task_created" | "task_updated" | "task_deleted" | 
            "task_assigned" | "task_unassigned" | "task_status_changed" | "task_deadline_changed" |
            "subtask_created" | "subtask_updated" | "subtask_deleted" |
            "subtask_assigned" | "subtask_unassigned" | "subtask_status_changed" |
            "user_created" | "user_updated" | "user_login" | "user_logout" |
            "role_changed" | "user_activated" | "user_deactivated";
    task_id?: string | undefined;
    subtask_id?: string | undefined;
    meta_data?: Record<string, unknown>;
    message: string;
    performed_by: string;
}