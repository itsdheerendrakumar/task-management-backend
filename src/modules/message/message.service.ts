import type { CreateGroup, EditChat } from "./message.dtos.js";
import { createGroupSchema, editChatSchema } from "./message.validation.js";
import { createGroupRepository, editChatRepository, getChatListingRepository } from "./messsage.repository.js";
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