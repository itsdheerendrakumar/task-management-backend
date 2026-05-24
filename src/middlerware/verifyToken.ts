import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt"
import { ErrorResponse } from "../utils/errorResponse";
import type { CustomRequest, DecodedToken } from "../utils/types";
export async function authVerification(req: CustomRequest, res: Response, next: NextFunction) {
    const {accessToken, refreshToken} = req.cookies;
    try {
        const decoded = verifyToken(accessToken, "access") as DecodedToken;
        req.user = decoded;
        next();
    } catch (error) {
        next(new ErrorResponse("Invalid access token", 401));
    }
}
