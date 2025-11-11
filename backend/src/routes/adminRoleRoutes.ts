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

const router = Router();

router.post("/", authenticate, createAdminController);
router.get("/", authenticate, getAllAdminsController);
router.get("/without-admin", authenticate, getAllUsersWithoutAdminController);
router.get("/:id", authenticate, getAdminByIdController);
router.put("/:id", authenticate, updateAdminController);
router.delete("/:id", authenticate, deleteAdminController);

export default router;
