"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
const jose_1 = require("jose");
const JWT_SECRET = process.env.JWT_SECRET;
async function requireAdmin(req, res, next) {
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
        const verified = await (0, jose_1.jwtVerify)(token, new TextEncoder().encode(JWT_SECRET));
        const payload = verified.payload;
        if (payload.role !== "ADMIN") {
            return res.status(403).json({ error: "Forbidden" });
        }
        req.adminId = payload.userId;
        next();
    }
    catch (err) {
        console.error("ADMIN AUTH ERROR:", err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
