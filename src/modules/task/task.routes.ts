import express from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { authVerification } from "../../middlerware/verifyToken.js"
import { createTask, getTaskListing } from "./task.controller.js"

const router = express.Router()

router.post("/", asyncHandler(authVerification(["admin"])), asyncHandler(createTask))
router.get("/", asyncHandler(authVerification()), asyncHandler(getTaskListing))

export default router
