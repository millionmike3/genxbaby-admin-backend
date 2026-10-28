import { Router } from "express";
import { getPrisma } from "@/lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const prisma = await getPrisma();

    const notifications = await prisma.adminNotification.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    res.json(notifications);
  } catch (err) {
    console.error("Failed to load notifications:", err);
    res.status(500).json({ error: "Failed to load notifications" });
  }
});

export default router;
