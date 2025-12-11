import { Router } from "express";
import { createTripController, getAllTripsController, getTripByIdController, updateTripController, deleteTripController, startTripController, endTripController, addDamageCostController, addTripPaymentController, updateTripDatesController, updateTripMeterController // ✅ import endTripController
 } from "../controllers/tripController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { completeTripController } from "../controllers/tripController.js";
const router = Router();
// All routes require authentication
router.use(authenticate);
// Anyone can view trips
router.get("/", authorizeRoles("Admin", "SuperAdmin", "Driver", "Customer"), getAllTripsController);
router.get("/:id", authorizeRoles("Admin", "SuperAdmin", "Driver", "Customer"), getTripByIdController);
// Only Admin/SuperAdmin can create/update/delete trips
router.post("/", authorizeRoles("Admin", "SuperAdmin"), createTripController);
router.put("/:id", authorizeRoles("Admin", "SuperAdmin"), updateTripController);
router.delete("/:id", authorizeRoles("Admin", "SuperAdmin"), deleteTripController);
// ----------------- Trip Lifecycle Routes -----------------
// Start trip (change status: Pending -> Ongoing, update vehicle & trip start_meter)
router.patch("/:id/start", authorizeRoles("Admin", "SuperAdmin"), startTripController);
// End trip (change status: Ongoing -> Ended, update vehicle meter, actual distance, cost, etc.)
router.patch("/:id/end", authorizeRoles("Admin", "SuperAdmin"), endTripController);
router.patch("/:id/damage", authorizeRoles("Admin", "SuperAdmin"), addDamageCostController);
router.post("/:id/payment", authorizeRoles("Admin", "SuperAdmin"), addTripPaymentController);
router.patch("/:id/update-dates", authorizeRoles("Admin", "SuperAdmin"), updateTripDatesController);
router.patch("/:id/update-meter", authorizeRoles("Admin", "SuperAdmin"), updateTripMeterController);
// Complete trip (Only if Ended + Paid)
router.patch("/:id/complete", authorizeRoles("Admin", "SuperAdmin"), completeTripController);
export default router;
//# sourceMappingURL=tripRoutes.js.map