import express from "express";
import { authVerification } from "../../middlerware/verifyToken.js";
import { deleteActivities, getActivities } from "./activity.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = express.Router();

router.get("/", asyncHandler(authVerification()), asyncHandler(getActivities));
router.delete("/", asyncHandler(authVerification()), asyncHandler(deleteActivities))
export default router;