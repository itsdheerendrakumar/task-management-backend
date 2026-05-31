import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt"
import { ErrorResponse } from "../utils/errorResponse";
import type { CustomRequest, DecodedToken, UserRoles } from "../utils/types";

export function authVerification(roles?: UserRoles[]) {
    return async function authVerification(req: CustomRequest, res: Response, next: NextFunction) {
        const { accessToken, refreshToken } = req.cookies;
        const decoded = verifyToken(accessToken ?? "", "access") as DecodedToken;
        req.user = decoded;
        if (!roles?.includes(decoded.role) && roles) {
            next(new ErrorResponse("Insufficient permissions", 403));
            return;
        }
        next();
    }
}
