import type { NextFunction, Request, Response } from "express";
import { loginService, refreshTokenService, registerService, logoutService } from "./auth.service.js";
import { successResponse } from "../../utils/response.js";
import type { CustomRequest } from "../../utils/types.js";

const isProduction = process.env.NODE_ENV === "production";

const getCookieOptions = (maxAge?: number) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  ...(maxAge !== undefined ? { maxAge } : {}),
});

export const register = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const result = await registerService(req.body);
  res.status(201).json(successResponse("User registered successfully", result));
};

export async function login(req: Request, res: Response, next: NextFunction) {
  const result = await loginService(req.body);
  res.cookie("refreshToken", result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
  res.cookie("accessToken", result.accessToken, getCookieOptions(15 * 60 * 1000));

  res.status(200).json(successResponse("Logged in successfully"));
}

export async function refreshToken(req: CustomRequest, res: Response, next: NextFunction) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Refresh token missing" });
  }
  const result = await refreshTokenService(refreshToken);
  res.cookie("refreshToken", result.refreshToken, getCookieOptions(result.remainingDuration));
  res.cookie("accessToken", result.accessToken, getCookieOptions(15 * 60 * 1000));
  res.status(200).json(successResponse("Token refreshed successfully"));
}

export async function logout(req: CustomRequest, res: Response, next: NextFunction) {
  const { accessToken, refreshToken } = req.cookies;
  const token = accessToken ?? refreshToken;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  await logoutService(token, accessToken ? "access" : "refresh");
  res.clearCookie("refreshToken", getCookieOptions());
  res.clearCookie("accessToken", getCookieOptions());
  res.status(200).json(successResponse("Logged out successfully"));
}