import type { CreateGroup, EditChat, SaveMessage } from "./message.dtos.js";
import Chat from "../../models/chat.js";
import Message from "../../models/message.js";
import ChatParticipant from "../../models/chatParticipant.js";
import type {Chat as ChatType} from "../../models/chat.js";

export async function createGroupRepository(chatData: CreateGroup, userId?: string): Promise<ChatType> {
    const { chatParticipants = [], type, name } = chatData;
    const newChat = await Chat.create({ type, name: name ?? "", ...(type === "group" && { created_by: userId }) });

    const participants = [...chatParticipants, userId]?.map((participantId) => ({
        chat_id: newChat._id,
        user_id: participantId,
        
    }));

    const newChatParticipants = await ChatParticipant.insertMany(participants)
    
    return newChat;
}

export async function getChatListingRepository(userId: string): Promise<any> {
    
    const chatListing = await ChatParticipant.find({
        user_id: userId
    })
    .populate({
        path: "chat_id",
        select: "type name image_url created_by"
    });

    console.log(chatListing);

    const chatIds = chatListing.map((chat) => chat.chat_id._id);
    const chatParticipants = await ChatParticipant.find({
        chat_id: { $in: chatIds }
    })
    .populate({
        path: "user_id",
        select: "name"
    });


    const chatParticipantsMap = chatParticipants.reduce((acc, participant) => {
        const chatId = participant.chat_id._id.toString();
        if (!acc[chatId]) {
            acc[chatId] = [];
        }
        acc[chatId].push(participant.user_id);
        return acc;
    }, {} as Record<string, { id: string; name: string; email: string }[]>);


    const chatsWithParticipants = chatListing.map((chat) => ({
        ...chat.chat_id.toObject(),
        participants: chatParticipantsMap[chat.chat_id._id.toString()] || []
    }));

    return chatsWithParticipants;
}

export async function editChatRepository(chatData: EditChat, userId: string): Promise<void> {

    if(chatData.name) {
        await Chat.updateOne({ _id: chatData.chat_id }, { name: chatData.name });
    }

    if(chatData.chatParticipants) {
        await ChatParticipant.insertMany(chatData.chatParticipants.map((participantId) => ({
            chat_id: chatData.chat_id,
            user_id: participantId,
        })));
    }

    return
}

export async function saveMessageRepository(messageData: SaveMessage, userId: string): Promise<any> {
    const newMessage = await Message.create({
        ...messageData,
        type: "text",
        sender_id: userId
    });

    await newMessage.populate("sender_id", "name");
    return newMessage;
}

export async function getMessagesRepository(chatId: string, userId: string): Promise<any> {
    const isParticipant = await ChatParticipant.findOne({
        chat_id: chatId,
        user_id: userId
    });

    if (!isParticipant) {
        throw new Error("User is not a participant in this chat");
    }

    const messages = await Message.find({ chat_id: chatId }).populate("sender_id", "name");
    return messages;
}

export async function getChatByIdRepository(chatId: string, messageId: string): Promise<any> {
    const chat = await Message.findOne({ _id: messageId, chat_id: chatId }).populate("sender_id", "name");
    return chat;
}