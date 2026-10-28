"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("@/lib/prisma");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    try {
        const prisma = await (0, prisma_1.getPrisma)();
        const notifications = await prisma.adminNotification.findMany({
            orderBy: { createdAt: "desc" },
            take: 200,
        });
        res.json(notifications);
    }
    catch (err) {
        console.error("Failed to load notifications:", err);
        res.status(500).json({ error: "Failed to load notifications" });
    }
});
exports.default = router;
