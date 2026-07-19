import jwt from "jsonwebtoken";
import type { DecodedToken } from "./types";
import { ErrorResponse } from "./errorResponse";

export function generateToken(payload: object, type: "access" | "refresh", duration?: number): string {
    const secretKey = type === "access" ? process.env.JWT_SECRET_ACCESS : process.env.JWT_SECRET_REFRESH;
    const expiresIn = duration || (type === "access" ? process.env.ACCESS_TOKEN_EXPIRATION : process.env.REFRESH_TOKEN_EXPIRATION);
    const token = jwt.sign(payload, secretKey!, { expiresIn: expiresIn as any });
    return token;
}

export function verifyToken(token: string, type: "access" | "refresh"): DecodedToken {
    try {
        const secretKey = type === "access" ? process.env.JWT_SECRET_ACCESS : process.env.JWT_SECRET_REFRESH;
        const decoded = jwt.verify(token, secretKey!) as DecodedToken;
        return decoded;
    } catch (error) {
        throw new ErrorResponse("Invalid or expired token", 401);
    }

}