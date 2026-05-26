import type { NextFunction } from "express";
import type { CustomRequest } from "../utils/types";
import { prisma } from "../lib/prisma";
import { ErrorResponse } from "../utils/errorResponse";

export function verifyRole(allowedRoles: string[]) {
    return async function (req:CustomRequest, res: Response, next: NextFunction) {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user?.user_id!
            }
        });
        if (!user || !allowedRoles.includes(user.role)) {
            throw new ErrorResponse("Access denied", 403);
        }
        next();
    }
}