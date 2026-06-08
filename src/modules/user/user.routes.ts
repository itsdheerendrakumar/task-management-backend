import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { changeProfile, changePassword, getProfile, getUserListing, getUserSelectListing } from "./user.controller.js";
import { authVerification } from "../../middlerware/verifyToken.js";
import { getProfileUpateMethod } from "./multer.js";
const router = express.Router();

router.get("/profile", asyncHandler(authVerification()), asyncHandler(getProfile));

router.get("/listing", asyncHandler(authVerification(["admin"])), asyncHandler(getUserListing));
router.get("/role-listing", asyncHandler(authVerification()), asyncHandler(getUserSelectListing));
router.patch(
    "/profile",
    asyncHandler(authVerification()),
    getProfileUpateMethod().single("profile_image"),
    asyncHandler(changeProfile)
);
router.patch(
    "/change-password",
    asyncHandler(authVerification()),
    asyncHandler(changePassword)
);
export default router;