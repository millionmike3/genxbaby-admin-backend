import express from "express";
import cors from "cors";
import auditRoutes from "./routes/audit";
import applicationRoutes from "./routes/applications";
import pipelineRoutes from "./routes/pipeline";
import notificationsRoute from "./routes/admin/notifications";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/admin", auditRoutes);
app.use("/admin", applicationRoutes);
app.use("/admin", pipelineRoutes);
app.use("/admin/notifications", notificationsRoute);

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Admin backend running on port ${PORT}`);
});
