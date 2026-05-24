import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getProfile } from "./user.controller.js";
import { authVerification } from "../../middlerware/verifyToken.js";
const router = express.Router();

router.get("/profile", asyncHandler(authVerification), asyncHandler(getProfile));
export default router;