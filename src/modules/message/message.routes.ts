import { asyncHandler } from "../../utils/asyncHandler.js";
import { authVerification } from "../../middlerware/verifyToken.js"
import express from "express";
import { createGroup } from "./message.controller.js";

const router = express.Router();

router.post(
    "/group",
    asyncHandler(authVerification(["admin"])),
    asyncHandler(createGroup)
)

export default router;