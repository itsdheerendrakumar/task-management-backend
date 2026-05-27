import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getProfile, getUserListing } from "./user.controller.js";
import { authVerification } from "../../middlerware/verifyToken.js";
const router = express.Router();

router.get("/profile", asyncHandler(authVerification()), asyncHandler(getProfile));

router.get("/listing", asyncHandler(authVerification(["admin"])), asyncHandler(getUserListing));
export default router;