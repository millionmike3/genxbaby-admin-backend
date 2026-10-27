import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

router.get("/applications", requireAdmin, async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        borrower: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.json({ success: true, applications });
  } catch (err) {
    console.error("APPLICATION LIST ERROR:", err);
    res.status(500).json({ error: "Failed to load applications" });
  }
});

router.post("/applications/:id/action", requireAdmin, async (req, res) => {
  try {
    const applicationId = req.params.id;
    const adminId = (req as any).adminId as string;
    const { action, notes } = req.body as {
      action: "approve" | "decline" | "request_docs";
      notes?: string;
    };

    if (!action) {
      return res
        .status(400)
        .json({ error: "Missing action: approve | decline | request_docs" });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (action === "approve") {
      await prisma.application.update({
        where: { id: applicationId },
        data: { status: "Approved" },
      });

      await prisma.underwritingAudit.create({
        data: {
          applicationId,
          adminId,
          action: "Approved",
          notes: notes ?? null,
        },
      });

      return res.json({ success: true, message: "Application approved" });
    }

    if (action === "decline") {
      await prisma.application.update({
        where: { id: applicationId },
        data: { status: "Declined" },
      });

      await prisma.underwritingAudit.create({
        data: {
          applicationId,
          adminId,
          action: "Declined",
          notes: notes ?? null,
        },
      });

      return res.json({ success: true, message: "Application declined" });
    }

    if (action === "request_docs") {
      await prisma.application.update({
        where: { id: applicationId },
        data: { status: "Docs Required" },
      });

      await prisma.underwritingAudit.create({
        data: {
          applicationId,
          adminId,
          action: "Requested Documents",
          notes: notes ?? null,
        },
      });

      return res.json({
        success: true,
        message: "Documents requested",
        required: [
          "Government ID",
          "Paystubs (30 days)",
          "Bank Statements (60 days)",
          "W‑2 / 1099",
          "Utility Bill",
        ],
      });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (err) {
    console.error("APPLICATION ACTION ERROR:", err);
    res.status(500).json({ error: "Failed to process action" });
  }
});

export default router;
