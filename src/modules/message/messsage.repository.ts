import type { CreateGroup } from "./message.dtos.js";
import Chat from "../../models/chat.js";
import ChatParticipant from "../../models/chatParticipant.js";
import type {Chat as ChatType} from "../../models/chat.js";

export async function createGroupRepository(chatData: CreateGroup, userId?: string): Promise<ChatType> {
    const { chatParticipants = [], type, name } = chatData;
    const newChat = await Chat.create({ type, name: name ?? "" });

    const participants = [...chatParticipants, userId]?.map((participantId) => ({
        chat_id: newChat._id,
        user_id: participantId,
    }));

    const newChatParticipants = await ChatParticipant.insertMany(participants)
    
    return newChat;
}