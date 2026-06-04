import express from "express";
import { login, refreshToken, register, logout } from "./auth.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authVerification } from "../../middlerware/verifyToken.js";
const router = express.Router();

router.post(
    "/register",
    asyncHandler(authVerification(["admin"])),
    asyncHandler(register)
)

router.post(
    "/login",
    asyncHandler(login)
)

router.get(
    "/refresh", 
    asyncHandler(refreshToken)
)

router.post(
    "/logout",
    asyncHandler(logout)
)
export default router;