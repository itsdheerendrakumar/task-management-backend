export const getActivityMessage = {
  task_created: (taskTitle: string) =>
    `created task "${taskTitle}"`,

  task_updated: (taskTitle: string) =>
    `updated task "${taskTitle}"`,

  task_deleted: (taskTitle: string) =>
    `deleted task "${taskTitle}"`,

  task_assigned: (taskTitle: string, assigneeName: string) =>
    `assigned task "${taskTitle}" to ${assigneeName}`,

  task_unassigned: (taskTitle: string, assigneeName: string) =>
    `unassigned ${assigneeName} from task "${taskTitle}"`,

  task_status_changed: (
    taskTitle: string,
    oldStatus: string,
    newStatus: string
  ) =>
    `changed task "${taskTitle}" status from ${oldStatus} to ${newStatus}`,

  task_deadline_changed: (
    taskTitle: string,
    oldDeadline: string,
    newDeadline: string
  ) =>
    `changed task "${taskTitle}" deadline from ${oldDeadline} to ${newDeadline}`,

  subtask_created: (subtaskTitle: string) =>
    `created subtask "${subtaskTitle}"`,

  subtask_updated: (subtaskTitle: string) =>
    `updated subtask "${subtaskTitle}"`,

  subtask_deleted: (subtaskTitle: string) =>
    `deleted subtask "${subtaskTitle}"`,

  subtask_assigned: (
    subtaskTitle: string,
    assigneeName: string
  ) =>
    `assigned subtask "${subtaskTitle}" to ${assigneeName}`,

  subtask_unassigned: (
    subtaskTitle: string,
    assigneeName: string
  ) =>
    `unassigned ${assigneeName} from subtask "${subtaskTitle}"`,

  subtask_status_changed: (
    subtaskTitle: string,
    oldStatus: string,
    newStatus: string
  ) =>
    `changed subtask "${subtaskTitle}" status from ${oldStatus} to ${newStatus}`,

  user_created: (userName: string) =>
    `created user ${userName}`,

  user_updated: (userName: string) =>
    `updated user ${userName}`,

  role_changed: (
    userName: string,
    oldRole: string,
    newRole: string
  ) =>
    `changed ${userName}'s role from ${oldRole} to ${newRole}`,

  user_activated: (userName: string) =>
    `activated user ${userName}`,

  user_deactivated: (userName: string) =>
    `deactivated user ${userName}`,
  user_logged_in: (userName: string) =>
    `${userName} logged in`,
  user_logged_out: (userName: string) =>
    `${userName} logged out`,
} as const;