import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getProfile, getUserListing, getUserSelectListing } from "./user.controller.js";
import { authVerification } from "../../middlerware/verifyToken.js";
const router = express.Router();

router.get("/profile", asyncHandler(authVerification()), asyncHandler(getProfile));

router.get("/listing", asyncHandler(authVerification(["admin"])), asyncHandler(getUserListing));
router.get("/role-listing", asyncHandler(authVerification()), asyncHandler(getUserSelectListing))
export default router;