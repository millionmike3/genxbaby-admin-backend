import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

router.get("/audit/logs", requireAdmin, async (req, res) => {
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
  } catch (err) {
    console.error("AUDIT LOGS ERROR:", err);
    res.status(500).json({ error: "Failed to load audit logs" });
  }
});

export default router;
