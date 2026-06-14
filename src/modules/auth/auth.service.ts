import { comparePassword } from "../../utils/comparePassword";
import { createUuid } from "../../utils/createUuid";
import { ErrorResponse } from "../../utils/errorResponse";
import { hashPassword } from "../../utils/hashPassword";
import { generateToken, verifyToken } from "../../utils/jwt";
import { createActivity } from "../activity/activity.repository";
import { getActivityMessage } from "../activity/activity.utils";
import type { RegisterUser } from "./auth.dtos";
import { findUserByEmail, storeSession, findSessionById, deleteSessionById, updateSession, creeateNewUser } from "./auth.repository";
import { loginSchema, registerSchema } from "./auth.validation";
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
    const id = createUuid(); // this is is used for inddentifying session because user can lgoin from multiple devices  
    const accessToken = generateToken({ id, user_id: user.id, role: user.role }, "access");
    const refreshToken = generateToken({ id, user_id: user.id}, "refresh");
    const hashedToken = hashPassword(refreshToken);
    await storeSession(user.id, hashedToken, id);
    createActivity({
        action: "user_login", 
        performed_by: user.id,
        message: getActivityMessage.user_logged_in(user.name ?? "", user.id)
    });
    return {accessToken, refreshToken};
}

export async function registerService(body: RegisterUser) {
    const validatedData = registerSchema.parse(body);
    const existingUser = await findUserByEmail(validatedData.email);
    if(existingUser) {
        throw new ErrorResponse("Email already in use", 400);
    }
    const hashedPassword = hashPassword(validatedData.password);
    const user = await creeateNewUser({...validatedData, password: hashedPassword});
    return user;
}

export async function refreshTokenService(refreshToken: string) {
    const decoded = verifyToken(refreshToken, "refresh");
    const session = await findSessionById(decoded.id);
    if(!session) {
        throw new ErrorResponse("Invalid session", 401);
    }
    const now = Date.now();
    if(session.expires_at.getTime() < now) {
        await deleteSessionById(session.id);
        throw new ErrorResponse("Session expired", 401);
    }
    const isValid = comparePassword(refreshToken, session.refresh_token);
    if(!isValid) {
        throw new ErrorResponse("Invalid refresh token", 401);
    }
    const newAccessToken = generateToken({ id: session.id, user_id: session.user.id, role: session.user.role }, "access");
    const remainingDuration = session.expires_at.getTime() - now;
    const newRefreshToken = generateToken({ id: session.id, user_id: session.user.id}, "refresh", remainingDuration);
    const hashedToken = hashPassword(newRefreshToken);
    await updateSession(session.id, hashedToken, remainingDuration);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logoutService(token: string, type: "access" | "refresh") {
    const decoded = verifyToken(token, type);
    createActivity({
        action: "user_logout",
        performed_by: decoded.user_id,
        message: getActivityMessage.user_logged_out(decoded.user_id)
    });
    await deleteSessionById(decoded.id);
}