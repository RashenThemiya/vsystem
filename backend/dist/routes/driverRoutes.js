// routes/driverRoutes.ts
import { Router } from "express";
import { createDriverController, getAllDriversController, getDriverByIdController, updateDriverController, getDriverTripsByStatusController, deleteDriverController, getDriverDetailsOnlyController, } from "../controllers/driverController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
const router = Router();
// 🔒 Require authentication for all routes
router.use(authenticate);
// 🟢 Admin or SuperAdmin can view drivers
router.get("/", authorizeRoles("Admin", "SuperAdmin"), getAllDriversController);
router.get("/:id", authorizeRoles("Admin", "SuperAdmin"), getDriverByIdController);
// 🔴 Only SuperAdmin can create/update/delete drivers
router.post("/", authorizeRoles("SuperAdmin"), createDriverController);
router.put("/:id", authorizeRoles("SuperAdmin"), updateDriverController);
router.delete("/:id", authorizeRoles("SuperAdmin"), deleteDriverController);
// 🟢 Admin & SuperAdmin can view driver trips
router.get("/:id/trips", authorizeRoles("Admin", "SuperAdmin", "Driver"), getDriverTripsByStatusController);
router.get("/:id/details", authorizeRoles("Admin", "SuperAdmin", "Driver"), getDriverDetailsOnlyController);
export default router;
//# sourceMappingURL=driverRoutes.js.map