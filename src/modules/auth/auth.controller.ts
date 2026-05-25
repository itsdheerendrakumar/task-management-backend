import type { NextFunction, Request, Response } from "express";
import { registerSchema } from "./auth.validation.js";
import { hashPassword } from "../../utils/hashPassword.js";
import { prisma } from "../../lib/prisma.js"
import { loginService, refreshTokenService } from "./auth.service.js";
import { successResponse } from "../../utils/response.js";
import type { CustomRequest } from "../../utils/types.js";
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = registerSchema.parse(req.body);
  const hashedPassword = hashPassword(validatedData.password);
  const user = await prisma.user.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: "admin"
    },
  });
  res.json({
    success: true,
    data: user,
  });
};

export async function login(req: Request, res: Response, next: NextFunction) {
  const result = await loginService(req.body);
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: true,
  });
  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: true,
  });

  res.status(200).json(successResponse("Logged in successfully"));
}

export async function refreshToken(req: CustomRequest, res: Response, next: NextFunction) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Refresh token missing" });
  }
  const result = await refreshTokenService(refreshToken);
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: true,
  });
  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: true,
  });
  res.status(200).json(successResponse("Token refreshed successfully"));
}