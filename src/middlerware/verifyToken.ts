import mongoose from "mongoose";
import type { NextFunction, Response } from "express";
import { verifyToken } from "../utils/jwt.js"
import { ErrorResponse } from "../utils/errorResponse.js";
import type { CustomRequest, DecodedToken, UserRoles } from "../utils/types.js";

export function authVerification(roles?: UserRoles[]) {
    return async function authVerification(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { accessToken } = req.cookies;
            if (!accessToken) {
                next(new ErrorResponse("Unauthorized", 401));
                return;
            }

            const decoded = verifyToken(accessToken, "access") as DecodedToken;
            
            if (!decoded || !decoded.user_id || !mongoose.Types.ObjectId.isValid(decoded.user_id)) {
                next(new ErrorResponse("Session invalid, please log in again", 401));
                return;
            }
            
            req.user = decoded;
            if (!roles?.includes(decoded.role) && roles) {
                next(new ErrorResponse("Insufficient permissions", 403));
                return;
            }
            next();
        } catch (error) {
            next(new ErrorResponse("Session invalid, please log in again", 401));
        }
    }
}
