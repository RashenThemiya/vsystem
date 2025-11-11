import { Router } from "express";
import {
  createAdminController,
  getAllAdminsController,
  getAdminByIdController,
  updateAdminController,
  deleteAdminController,
  getAllUsersWithoutAdminController,
} from "../controllers/adminRoleController";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// 🔒 Require authentication for all routes
router.use(authenticate);

/**
 * 👥 Admin or SuperAdmin can view admin list or specific admin
 */
router.get("/", authorizeRoles("Admin", "SuperAdmin"), getAllAdminsController);
router.get("/:id", authorizeRoles("Admin", "SuperAdmin"), getAdminByIdController);
router.get("/without-admin", authorizeRoles("Admin", "SuperAdmin"), getAllUsersWithoutAdminController);

/**
 * 🟢 Only SuperAdmin can create, update, or delete admins
 */
router.post("/", authorizeRoles("SuperAdmin"), createAdminController);
router.put("/:id", authorizeRoles("SuperAdmin"), updateAdminController);
router.delete("/:id", authorizeRoles("SuperAdmin"), deleteAdminController);

export default router;
