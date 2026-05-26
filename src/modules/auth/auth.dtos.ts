import z from "zod"
import type { registerSchema } from "./auth.validation"
export type RegisterUser = z.infer<typeof registerSchema>