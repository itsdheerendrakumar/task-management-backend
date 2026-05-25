import {type Request} from "express";

export interface DecodedToken {
    id: string;
    user_id: number;
    email: string;
    iat: number;
    exp: number;
}

export interface CustomRequest extends Request {
    user?: DecodedToken;
}