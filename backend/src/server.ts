import app from "./app.js";
import dotenv from "dotenv";
import { createSuperAdmin } from "./utils/createSuperAdmin.js";
import cors from "cors";
import { seedFuelIfNotExists } from "./config/seedFuelIfNotExists.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
// Create default super admin at startup
createSuperAdmin();
await seedFuelIfNotExists();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
