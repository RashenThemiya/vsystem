import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import AdminRoleRoutes from "./routes/adminRoleRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import fuelRoutes from "./routes/fuelRoutes.js";
import Triproutes from "./routes/tripRoutes.js";
import BillUploadRoutes from "./routes/billUploadRoutes.js";
import VehicleOtherCostRoutes from "./routes/vehicleOtherCostRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
dotenv.config();

const app = express();

// ✅ Enable CORS first
app.use(cors({ origin: "*" }));

// ✅ Increase payload size limits BEFORE routes
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ❌ Don't call express.json() twice — only once, with limit option

// ✅ Register routes AFTER setting limits
app.use("/api/admin", adminRoutes);
app.use("/api/owners", ownerRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/admin-roles", AdminRoleRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/fuels", fuelRoutes);
app.use("/api/trips", Triproutes);
app.use("/api/bill-uploads", BillUploadRoutes);
app.use("/api/vehicle-other-costs", VehicleOtherCostRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("🚗 Vehicle Rent Management API is running...");
});

export default app;
