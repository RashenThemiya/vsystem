import { Router } from "express";
import { getDashboardKPIsController, getVehicleExpiryNotificationsController  } from "../controllers/dashboardController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// 🔒 All routes require authentication
router.use(authenticate);

/**
 * 👑 Admin or SuperAdmin can view dashboard KPIs
 */
router.get("/kpis", authorizeRoles("Admin", "SuperAdmin"), getDashboardKPIsController);
router.get(
  "/vehicle-expiry",
  authorizeRoles("Admin", "SuperAdmin"),
  getVehicleExpiryNotificationsController
);

export default router;
