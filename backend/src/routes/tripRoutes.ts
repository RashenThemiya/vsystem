import { Router } from "express";
import {
  createTripController,
  getAllTripsController,
  getTripByIdController,
  updateTripController,
  deleteTripController,
  startTripController,
  endTripController, // ✅ import endTripController
} from "../controllers/tripController";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

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

export default router;
