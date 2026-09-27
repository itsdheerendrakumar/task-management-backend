import type { NextFunction, Response } from "express"
import type { CustomRequest } from "../../utils/types";
import { createGroupService, editChatService, getChatListingService, getMessagesService, saveMessageService } from "./message.service.js";
import { successResponse } from "../../utils/response";

export async function createGroup(req: CustomRequest, res: Response, next: NextFunction) {
    console.log(req.user);

    const response = await createGroupService(req.body, req.user?.user_id as string);
    return res.status(201).json(successResponse("Group created successfully", response));
}

export async function getChatListing(req: CustomRequest, res: Response, next: NextFunction) {
    
    const response = await getChatListingService(req.user?.user_id as string);
    
    return res.status(200).json(successResponse("Chat listing fetched successfully", response));
}

export async function editChat(req: CustomRequest, res: Response, next: NextFunction) {
    console.log(req.body);
    const response = await editChatService(req.body, req.user?.user_id as string);
    return res.status(200).json(successResponse("Chat edited successfully"));
}

export async function saveMessage(req: CustomRequest, res: Response, next: NextFunction) {
    console.log(req.body);
    const response = await saveMessageService(req.body, req.user?.user_id as string);
    return res.status(200).json(successResponse("Message saved successfully", response));
}

export async function getMessages(req: CustomRequest, res: Response, next: NextFunction) {
    const { chatId } = req.params;
    const response = await getMessagesService(chatId as string, req.user?.user_id as string);
    return res.status(200).json(successResponse("Messages fetched successfully", response));
}