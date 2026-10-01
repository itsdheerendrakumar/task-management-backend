import type { CreateGroup, EditChat, SaveMessage } from "./message.dtos.js";
import { createGroupSchema, editChatSchema, saveMessageSchema } from "./message.validation.js";
import { createGroupRepository, editChatRepository, getChatListingRepository, getMessagesRepository, saveMessageRepository } from "./messsage.repository.js";
import type {Chat as ChatType} from "../../models/chat.js";

export async function createGroupService(chatData: CreateGroup, userId: string): Promise<ChatType> {

    const validatedData = createGroupSchema.parse(chatData);
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

export async function saveMessageService(messageData: SaveMessage, userId: string): Promise<any> {
    const validatedData = saveMessageSchema.parse(messageData);
    const response = await saveMessageRepository(validatedData, userId);
    return response;
}

export async function getMessagesService(chatId: string, userId: string): Promise<any> {
    const response = await getMessagesRepository(chatId, userId);
    return response;
}
    