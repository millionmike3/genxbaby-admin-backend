"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get("/pipeline", auth_1.requireAdmin, async (req, res) => {
    try {
        const apps = await prisma.application.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                underwriting: true,
                pipelineOutput: true,
                loanServicingEvents: true,
                servicingEventScore: true,
                servicingRiskSignal: true,
                servicingRecord: true,
            },
        });
        res.json({ success: true, applications: apps });
    }
    catch (err) {
        console.error("PIPELINE ERROR:", err);
        res.status(500).json({ error: "Failed to load pipeline" });
    }
});
exports.default = router;
