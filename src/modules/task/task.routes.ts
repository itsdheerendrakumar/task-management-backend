import express from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { authVerification } from "../../middlerware/verifyToken.js"
import { createTask, getLastOneYearTaskMonthWise, getTaskListing, getTaskMetrics} from "./task.controller.js"

const router = express.Router()

router.post("/", asyncHandler(authVerification(["admin"])), asyncHandler(createTask))
router.get("/", asyncHandler(authVerification()), asyncHandler(getTaskListing))
router.get("/metrics", asyncHandler(authVerification()), asyncHandler(getTaskMetrics))
router.get("/last-one-year", asyncHandler(authVerification()), asyncHandler(getLastOneYearTaskMonthWise))

export default router
