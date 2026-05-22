import { comparePassword } from "../../utils/comparePassword";
import { createUuid } from "../../utils/createUuid";
import { ErrorResponse } from "../../utils/errorResponse";
import { hashPassword } from "../../utils/hashPassword";
import { generateToken } from "../../utils/jwt";
import { findUserByEmail, storeSession } from "./auth.repository";
import { loginSchema } from "./auth.validation";
import z from "zod"
export async function loginService(body: z.infer<typeof loginSchema>) {
    const validatedData = loginSchema.parse(body);
    const user = await findUserByEmail(validatedData.email);
    if(!user) {
        throw new ErrorResponse("Invalid credentials", 400);
    }
    const isMatch = comparePassword(validatedData.password, user?.password);
    if(!isMatch) {
        throw new ErrorResponse("Invalid credentials", 400);
    }
    const id = createUuid();
    const family_id = createUuid();
    const accessToken = generateToken({family_id, id, user_id: user.id}, "access");
    const refreshToken = generateToken({family_id, id, user_id: user.id}, "refresh");
    const hashedToken = hashPassword(refreshToken);
    await storeSession(user.id, hashedToken, family_id, id);
    return {accessToken, refreshToken};
}