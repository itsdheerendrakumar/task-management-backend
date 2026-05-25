import express from "express";
import { login, refreshToken, register } from "./auth.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = express.Router();

// router.post(
//     "/register",
//     asyncHandler(register)
// )

router.post(
    "/login",
    asyncHandler(login)
)

router.get(
    "/refresh", 
    asyncHandler(refreshToken)
)
export default router;