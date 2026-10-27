import express from "express";
import cors from "cors";
import auditRoutes from "./routes/audit";
import applicationRoutes from "./routes/applications";
import pipelineRoutes from "./routes/pipeline";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/admin", auditRoutes);
app.use("/admin", applicationRoutes);
app.use("/admin", pipelineRoutes);

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Admin backend running on port ${PORT}`);
});
