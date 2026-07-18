import express from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { authVerification } from "../../middlerware/verifyToken.js"
import { createTask, getLastOneYearTaskMonthWise, getTaskListing, getTaskMetrics, updateTaskStatus } from "./task.controller.js"

const router = express.Router()

router.post("/", asyncHandler(authVerification(["admin"])), asyncHandler(createTask))
router.patch("/:task_id/status", asyncHandler(authVerification()), asyncHandler(updateTaskStatus))
router.get("/", asyncHandler(authVerification()), asyncHandler(getTaskListing))
router.get("/metrics", asyncHandler(authVerification()), asyncHandler(getTaskMetrics))
router.get("/last-one-year", asyncHandler(authVerification()), asyncHandler(getLastOneYearTaskMonthWise))

export default router
