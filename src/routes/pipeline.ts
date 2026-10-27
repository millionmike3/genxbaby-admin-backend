import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

router.get("/pipeline", requireAdmin, async (req, res) => {
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
  } catch (err) {
    console.error("PIPELINE ERROR:", err);
    res.status(500).json({ error: "Failed to load pipeline" });
  }
});

export default router;
