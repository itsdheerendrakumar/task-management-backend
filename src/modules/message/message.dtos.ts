import {z} from "zod";
import type { createGroupSchema } from "./message.validation.js";

export type CreateGroup = z.infer<typeof createGroupSchema>