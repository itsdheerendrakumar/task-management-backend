import express from "express";
import { authVerification } from "../../middlerware/verifyToken.js";
import { getActivities } from "./activity.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = express.Router();

router.get("/", asyncHandler(authVerification()), asyncHandler(getActivities));
export default router;