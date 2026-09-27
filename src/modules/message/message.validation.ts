import {z} from "zod";

export const createGroupSchema = z.object({
    type: z.enum(["private", "group"], {
        message: "Invalid chat type"
    }),
    name: z.string().optional(),
    chatParticipants: z.array(z.string()).optional(),
})

export const editChatSchema = z.object({
    chat_id: z.string({
        message: "Chat ID is required",
    }),
    name: z.string().optional(),
    chatParticipants: z.array(z.string()).optional(),
});