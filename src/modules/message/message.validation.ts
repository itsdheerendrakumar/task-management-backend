import {z} from "zod";

export const createGroupSchema = z.object({
    type: z.enum(["private", "group"], {
        message: "Invalid chat type"
    }),
    name: z.string().optional(),
    chatParticipants: z.array(z.string()).optional(),
})