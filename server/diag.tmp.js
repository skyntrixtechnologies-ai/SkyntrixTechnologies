import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

const { default: Lead } = await import("./models/Lead.model.js");
const { default: Admin } = await import("./models/Admin.model.js");

await mongoose.connect(process.env.MONGODB_URI);

const admin = await Admin.findOne({ isActive: true });
if (!admin) { console.log("no active admin"); process.exit(1); }
console.log("admin:", admin._id.toString(), admin.email, admin.role);

const token = jwt.sign({ sub: admin._id.toString(), role: admin.role }, process.env.JWT_SECRET || "skyntrix-jwt-secret", { expiresIn: "1h" });

const { default: app } = await import("./app.js");
const server = app.listen(0);
const port = server.address().port;
const base = `http://127.0.0.1:${port}/api`;

const lead = await Lead.findOne({ status: { $nin: ["closed", "converted"] } });
if (!lead) { console.log("no lead to test"); process.exit(1); }
console.log("TEST LEAD:", lead._id.toString(), "| current status:", lead.status);

const target = lead.status === "new" ? "contacted" : "new";

const res = await fetch(`${base}/leads/admin/${lead._id}/status`, {
  method: "PUT",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ status: target, note: "integration-test" }),
});

const body = await res.json();
console.log("HTTP", res.status);
console.log("response success:", body.success, "| message:", body.message);
if (res.ok) {
  console.log("returned status:", body.data.status);
  const fresh = await Lead.findById(lead._id).lean();
  console.log("DB status after call:", fresh.status, "| stageLog len:", (fresh.stageLog || []).length);
} else {
  console.log("errors:", JSON.stringify(body.errors || body));
}

server.close();
await mongoose.disconnect();