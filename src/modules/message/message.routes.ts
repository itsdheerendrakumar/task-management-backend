import { asyncHandler } from "../../utils/asyncHandler.js";
import { authVerification } from "../../middlerware/verifyToken.js"
import express from "express";
import { createGroup, editChat, getChatListing, getIndvidualContacts, getMessages, saveMessage } from "./message.controller.js";

const router = express.Router();

router.post(
    "/group",
    asyncHandler(authVerification(["admin", "member", "projectManager"])),
    asyncHandler(createGroup)
)

router.patch(
    "/group",
    asyncHandler(authVerification(["admin"])),
    asyncHandler(editChat)
)

router.get(
    "/chat-listing",
    asyncHandler(authVerification()),
    asyncHandler(getChatListing)
)

router.post(
    "/",
    asyncHandler(authVerification()),
    asyncHandler(saveMessage)
)



router.get(
    "/contact",
    asyncHandler(authVerification()),
    asyncHandler(getIndvidualContacts)
)

router.get(
    "/:chatId",
    asyncHandler(authVerification()),
    asyncHandler(getMessages)
)

export default router;