import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cookieHeader = req.headers.cookie ?? "";
    const token = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const payload: any = verified.payload;

    if (payload.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    (req as any).adminId = payload.userId;
    next();
  } catch (err) {
    console.error("ADMIN AUTH ERROR:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
