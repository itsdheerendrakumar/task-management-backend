import type { CreateGroup, EditChat, SaveMessage } from "./message.dtos.js";
import { createGroupSchema, editChatSchema, saveMessageSchema } from "./message.validation.js";
import { createGroupRepository, editChatRepository, getChatListingRepository, getIndvidualContactsRepository, getMessagesRepository, saveMessageRepository, markAsReadRepository, getTotalPendingMessagesRepository, getMessageFileRepository } from "./messsage.repository.js";
import type { Chat as ChatType } from "../../models/chat.js";
import { ErrorResponse } from "../../utils/errorResponse.js";
import cloudinary, { uploadBufferToCloudinary } from "../../lib/cloudinary.js";

export async function createGroupService(chatData: CreateGroup, userId: string, userRole: string): Promise<ChatType> {

    const validatedData = createGroupSchema.parse(chatData);
    if (validatedData.type === "group" && userRole !== "admin") {
        throw new ErrorResponse("Only admin can create group chats", 403);
    }
    const response = await createGroupRepository(validatedData, userId);
    return response;

}

export async function getChatListingService(userId: string): Promise<any> {

    const response = await getChatListingRepository(userId);
    return response;
}

export async function editChatService(chatData: EditChat, userId: string): Promise<void> {

    const validatedData = editChatSchema.parse(chatData);
    const response = await editChatRepository(validatedData, userId);
    return;

}

export async function saveMessageService(messageData: SaveMessage, userId: string, file?: Express.Multer.File): Promise<any> {
    const validatedData = saveMessageSchema.parse(messageData);

    if (!validatedData.content?.trim() && !file) {
        throw new ErrorResponse("Message must contain either text content or an attachment", 400);
    }

    let attachment_public_id = "";
    let attachment_format = "";

    if (file) {
        const uploaded = await uploadBufferToCloudinary(
            file.buffer,
            file.mimetype,
            "taskManagement/message",
            "authenticated"
        );
        attachment_public_id = uploaded.public_id;
        attachment_format = uploaded.format || file.mimetype.split("/")[1] || "";
    }

    const payloadToSave = {
        ...validatedData,
        ...(attachment_public_id && { attachment_public_id }),
        ...(attachment_format && { attachment_format })
    };

    const response = await saveMessageRepository(payloadToSave, userId);
    return response;
}

export async function getMessagesService(chatId: string, userId: string): Promise<any> {
    const response = await getMessagesRepository(chatId, userId);
    return response;
}

export async function markAsReadService(chatId: string, userId: string): Promise<void> {
    await markAsReadRepository(chatId, userId);
}

export async function getIndvidualContactsService(): Promise<any> {
    const response = await getIndvidualContactsRepository();
    return response;
}

export async function getTotalPendingMessagesService(userId: string): Promise<number> {
    const response = await getTotalPendingMessagesRepository(userId);
    return response;
}

export async function getMessageFileService(messageId: string, userId: string): Promise<string> {
    const message = await getMessageFileRepository(messageId, userId);

    if (!message.attachment_public_id) {
        throw new ErrorResponse("Message does not have an attachment", 404);
    }

    const url = cloudinary.url(message.attachment_public_id, {
        type: "authenticated",
        secure: true,
        sign_url: true,
        format: message.attachment_format || 'jpg'
    });

    return url;
}