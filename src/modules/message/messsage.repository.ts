import type { CreateGroup, EditChat, SaveMessage } from "./message.dtos.js";
import Chat from "../../models/chat.js";
import Message from "../../models/message.js";
import ChatParticipant from "../../models/chatParticipant.js";
import type { Chat as ChatType } from "../../models/chat.js";
import { User } from "../../models/User.js";
import mongoose from "mongoose";

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

    // console.log(chatListing);

    const chatIds = chatListing.map((chat) => chat.chat_id._id);
    const chatParticipants = await ChatParticipant.find({
        chat_id: { $in: chatIds }
    })
        .populate({
            path: "user_id",
            select: "name"
        });

    const lastMessages = await Message.aggregate([
        { $match: { chat_id: { $in: chatIds } } },
        { $sort: { createdAt: -1 } },
        { $group: { _id: "$chat_id", lastMessage: { $first: "$$ROOT" } } }
    ]);

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
        participants: chatParticipantsMap[chat.chat_id._id.toString()] || [],
        lastMessage: lastMessages.find((msg) => msg._id.toString() === chat.chat_id._id.toString())?.lastMessage || null,
        unread_count: chat.unread_count || 0
    }));

    return chatsWithParticipants;
}

export async function editChatRepository(chatData: EditChat, userId: string): Promise<void> {

    if (chatData.name) {
        await Chat.updateOne({ _id: chatData.chat_id }, { name: chatData.name });
    }

    if (chatData.chatParticipants) {
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

    await ChatParticipant.updateMany(
        { chat_id: messageData.chat_id, user_id: { $ne: userId } },
        { $inc: { unread_count: 1 } }
    );

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
    isParticipant.last_read_at = new Date();
    isParticipant.unread_count = 0;
    await isParticipant.save();
    const messages = await Message.find({ chat_id: chatId }).populate("sender_id", "name");
    return messages;
}

export async function markAsReadRepository(chatId: string, userId: string): Promise<void> {
    await ChatParticipant.updateOne(
        { chat_id: chatId, user_id: userId },
        { $set: { unread_count: 0, last_read_at: new Date() } }
    );
}

export async function getIndvidualContactsRepository(): Promise<any> {
    console.log("Fetching individual contacts");
    const contacts = await User.find({ role: { $ne: "client" } }).select('name email role profile_image');
    return contacts;
}

export async function getTotalPendingMessagesRepository(userId: string): Promise<any> {
    const totalPendingMessages = await ChatParticipant.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalUnread: { $sum: "$unread_count" } } }
    ]);
    return { unread_count: totalPendingMessages[0]?.totalUnread || 0 };
}