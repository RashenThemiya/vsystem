import { Router } from "express";
import {
  createBillController,
  getAllBillsController,
  getBillByIdController,
  updateBillController,
  deleteBillController,
} from "../controllers/billUploadController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(authenticate);

// Admin/SuperAdmin can view
router.get("/", authorizeRoles("Admin", "SuperAdmin"), getAllBillsController);
router.get("/:id", authorizeRoles("Admin", "SuperAdmin"), getBillByIdController);

// SuperAdmin can manage
router.post("/", authorizeRoles("SuperAdmin"), createBillController);
router.put("/:id", authorizeRoles("SuperAdmin"), updateBillController);
router.delete("/:id", authorizeRoles("SuperAdmin"), deleteBillController);

export default router;
