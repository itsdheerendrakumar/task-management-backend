import {z} from "zod";
import type { createGroupSchema, editChatSchema, saveMessageSchema } from "./message.validation.js";

export type CreateGroup = z.infer<typeof createGroupSchema>
export type EditChat = z.infer<typeof editChatSchema>
export type SaveMessage = z.infer<typeof saveMessageSchema>