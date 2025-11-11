import { Router } from "express";
import {
  createOwnerController,
  getAllOwnersController,
  getOwnerByIdController,
  updateOwnerController,
  deleteOwnerController,
} from "../controllers/ownerController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// 🔒 Apply authentication to all routes
router.use(authenticate);

// 🟢 Only Admin or SuperAdmin can view owners
router.get("/", authorizeRoles("Admin", "SuperAdmin"), getAllOwnersController);
router.get("/:id", authorizeRoles("Admin", "SuperAdmin"), getOwnerByIdController);

// 🔴 Only SuperAdmin can manage owners (create/update/delete)
router.post("/", authorizeRoles("SuperAdmin"), createOwnerController);
router.put("/:id", authorizeRoles("SuperAdmin"), updateOwnerController);
router.delete("/:id", authorizeRoles("SuperAdmin"), deleteOwnerController);

export default router;
