"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get("/audit/logs", auth_1.requireAdmin, async (req, res) => {
    try {
        const logs = await prisma.audit.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                admin: {
                    select: {
                        email: true,
                        walletAddress: true,
                    },
                },
            },
        });
        res.json({ logs });
    }
    catch (err) {
        console.error("AUDIT LOGS ERROR:", err);
        res.status(500).json({ error: "Failed to load audit logs" });
    }
});
exports.default = router;
