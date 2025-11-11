import { Router } from "express";
import {
  createFuelController,
  getAllFuelsController,
  getFuelByIdController,
  updateFuelController,
  deleteFuelController,
} from "../controllers/fuelController.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// 🔒 All routes require authentication
router.use(authenticate);

/**
 * 🟢 Routes
 */
router.post("/", authorizeRoles("Admin", "SuperAdmin"), createFuelController);
router.get("/", getAllFuelsController);
router.get("/:id", getFuelByIdController);
router.put("/:id", authorizeRoles("Admin", "SuperAdmin"), updateFuelController);
router.delete("/:id", authorizeRoles("SuperAdmin"), deleteFuelController);

export default router;
