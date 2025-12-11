import { Router } from "express";
import { createVehicleCostController, getAllVehicleCostsController, getVehicleCostByIdController, updateVehicleCostController, deleteVehicleCostController, } from "../controllers/vehicleOtherCostController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
const router = Router();
router.use(authenticate);
router.get("/", authorizeRoles("Admin", "SuperAdmin"), getAllVehicleCostsController);
router.get("/:id", authorizeRoles("Admin", "SuperAdmin"), getVehicleCostByIdController);
router.post("/", authorizeRoles("SuperAdmin"), createVehicleCostController);
router.put("/:id", authorizeRoles("SuperAdmin"), updateVehicleCostController);
router.delete("/:id", authorizeRoles("SuperAdmin"), deleteVehicleCostController);
export default router;
//# sourceMappingURL=vehicleOtherCostRoutes.js.map