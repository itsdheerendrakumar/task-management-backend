import {type Request} from "express";

export interface DecodedToken {
    id: string;
    user_id: string;
    email: string;
    role: UserRoles;
    iat: number;
    exp: number;
}

export interface CustomRequest extends Request {
    user?: DecodedToken;
}

export type UserRoles = "admin" | "member" | "client" | "projectManager";