import type { NextFunction, Request, Response } from "express";
import { loginService, refreshTokenService, registerService, logoutService } from "./auth.service.js";
import { successResponse } from "../../utils/response.js";
import type { CustomRequest } from "../../utils/types.js";
export const register = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const result = await registerService(req.body);
  res.status(201).json(successResponse("User registered successfully", result));
};

export async function login(req: Request, res: Response, next: NextFunction) {
  const result = await loginService(req.body);
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000,
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

export async function logout(req: CustomRequest, res: Response, next: NextFunction) {
  const { accessToken, refreshToken } = req.cookies;
  const token = accessToken ?? refreshToken;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  await logoutService(token, accessToken ? "access" : "refresh");
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  res.clearCookie("accessToken", { httpOnly: true, secure: true });
  res.status(200).json(successResponse("Logged out successfully"));
}