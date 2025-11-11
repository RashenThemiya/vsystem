import { Router } from "express";
import {
  createVehicleController,
  getAllVehiclesController,
  getVehicleByIdController,
  updateVehicleController,
  deleteVehicleController,
} from "../controllers/vehicleController";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticate);

router.post("/", authorizeRoles("SuperAdmin"), createVehicleController);
router.get("/", authorizeRoles("SuperAdmin", "Admin", "Manager"), getAllVehiclesController);
router.get("/:id", authorizeRoles("SuperAdmin", "Admin", "Manager"), getVehicleByIdController);
router.put("/:id", authorizeRoles("SuperAdmin"), updateVehicleController);
router.delete("/:id", authorizeRoles("SuperAdmin"), deleteVehicleController);

export default router;
