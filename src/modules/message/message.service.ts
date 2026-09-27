import type { CreateGroup } from "./message.dtos.js";
import { createGroupSchema } from "./message.validation.js";
import { createGroupRepository } from "./messsage.repository.js";
import type {Chat as ChatType} from "../../models/chat.js";

export async function createGroupService(chatData: CreateGroup, userId: string): Promise<ChatType> {

    const validatedData = createGroupSchema.parse(chatData);
    const response = await createGroupRepository(validatedData, userId);
    return response;

}