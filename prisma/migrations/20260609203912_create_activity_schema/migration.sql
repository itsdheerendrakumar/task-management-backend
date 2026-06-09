-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('task_created', 'task_updated', 'task_deleted', 'task_assigned', 'task_unassigned', 'task_status_changed', 'task_deadline_changed', 'subtask_created', 'subtask_updated', 'subtask_deleted', 'subtask_assigned', 'subtask_unassigned', 'subtask_status_changed', 'user_created', 'user_updated', 'role_changed', 'user_activated', 'user_deactivated');

-- CreateTable
CREATE TABLE "Activities" (
    "id" SERIAL NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "message" TEXT NOT NULL,
    "task_id" INTEGER,
    "subtask_id" INTEGER,
    "meta_data" JSONB,
    "performed_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Activities_performed_by_idx" ON "Activities"("performed_by");

-- AddForeignKey
ALTER TABLE "Activities" ADD CONSTRAINT "Activities_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
