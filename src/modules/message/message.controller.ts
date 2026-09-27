import type { NextFunction, Response } from "express"
import type { CustomRequest } from "../../utils/types";
import { createGroupService } from "./message.service.js";

export async function createGroup(req: CustomRequest, res: Response, next: NextFunction) {
    console.log(req.user);

    const response = await createGroupService(req.body, req.user?.user_id as string);
    res.json(response);
}