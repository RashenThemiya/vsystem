import { Router } from "express";
import {
  createCustomerController,
  getAllCustomersController,
  getCustomerByIdController,
  updateCustomerController,
  deleteCustomerController,
} from "../controllers/customerController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// 🔒 Require authentication for all routes
router.use(authenticate);

/**
 * 👥 Admin or SuperAdmin can view customers
 */
router.get("/", authorizeRoles("Admin", "SuperAdmin"), getAllCustomersController);
router.get("/:id", authorizeRoles("Admin", "SuperAdmin"), getCustomerByIdController);

/**
 * 🟢 Admin or SuperAdmin can create customers
 */
router.post("/", authorizeRoles("Admin", "SuperAdmin"), createCustomerController);

/**
 * 🟡 Admin or SuperAdmin can update customers
 */
router.put("/:id", authorizeRoles("Admin", "SuperAdmin"), updateCustomerController);

/**
 * 🔴 Only SuperAdmin can delete customers
 */
router.delete("/:id", authorizeRoles("SuperAdmin"), deleteCustomerController);

export default router;
