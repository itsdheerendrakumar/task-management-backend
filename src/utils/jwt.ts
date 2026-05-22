import jwt from "jsonwebtoken";

export function generateToken(payload: object, type: "access" | "refresh"): string {
    const secretKey = type === "access" ? process.env.JWT_SECRET_ACCESS : process.env.JWT_SECRET_REFRESH;
    const expiresIn = type === "access" ? process.env.ACCESS_TOKEN_EXPIRATION : process.env.REFRESH_TOKEN_EXPIRATION;
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
}