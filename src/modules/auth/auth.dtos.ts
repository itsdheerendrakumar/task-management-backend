import z from "zod"
import type { registerSchema } from "./auth.validation.js"
export type RegisterUser = z.infer<typeof registerSchema>
export interface NewUser extends RegisterUser {
    password: string
}