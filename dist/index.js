"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const audit_1 = __importDefault(require("./routes/audit"));
const applications_1 = __importDefault(require("./routes/applications"));
const pipeline_1 = __importDefault(require("./routes/pipeline"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use("/admin", audit_1.default);
app.use("/admin", applications_1.default);
app.use("/admin", pipeline_1.default);
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Admin backend running on port ${PORT}`);
});
