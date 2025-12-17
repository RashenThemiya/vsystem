import { Router, Request, Response, NextFunction } from "express";
import AsyncLock from "async-lock"; // ✅ import async-lock
import {
  createTripController,
  getAllTripsController,
  getTripByIdController,
  updateTripController,
  deleteTripController,
  startTripController,
  endTripController,
  addDamageCostController,
  addTripPaymentController,
  updateTripDatesController,
  updateTripMeterController,
  cancelTripController,
  completeTripController,
} from "../controllers/tripController";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();
const lock = new AsyncLock(); // initialize lock

// All routes require authentication
router.use(authenticate);

// ----------------- View Trips -----------------
// Anyone can view trips
router.get(
  "/",
  authorizeRoles("Admin", "SuperAdmin", "Driver", "Customer"),
  getAllTripsController
);

router.get(
  "/:id",
  authorizeRoles("Admin", "SuperAdmin", "Driver", "Customer"),
  getTripByIdController
);

// ----------------- Trip Creation (LOCKED) -----------------
// Only Admin/SuperAdmin can create trips, lock ensures only one request runs at a time
router.post(
  "/",
  authorizeRoles("Admin", "SuperAdmin"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await lock.acquire("createTrip", async () => {
        await createTripController(req, res, next);
      });
    } catch (err) {
      next(err); // forward errors to Express
    }
  }
);

// ----------------- Update / Delete Trips -----------------
// No lock needed
router.put("/:id", authorizeRoles("Admin", "SuperAdmin"), updateTripController);
router.delete("/:id", authorizeRoles("Admin", "SuperAdmin"), deleteTripController);

// ----------------- Trip Lifecycle -----------------
// Start trip (Pending -> Ongoing)
router.patch("/:id/start", authorizeRoles("Admin", "SuperAdmin", "Driver"), startTripController);

// End trip (Ongoing -> Ended)
router.patch("/:id/end", authorizeRoles("Admin", "SuperAdmin", "Driver"), endTripController);

// Add damage cost
router.patch("/:id/damage", authorizeRoles("Admin", "SuperAdmin"), addDamageCostController);

// Add trip payment
router.post("/:id/payment", authorizeRoles("Admin", "SuperAdmin"), addTripPaymentController);

// Update trip dates
router.patch("/:id/update-dates", authorizeRoles("Admin", "SuperAdmin"), updateTripDatesController);

// Update trip meter
router.patch("/:id/update-meter", authorizeRoles("Admin", "SuperAdmin"), updateTripMeterController);

// Complete trip (Only if Ended + Paid)
router.patch("/:id/complete", authorizeRoles("Admin", "SuperAdmin"), completeTripController);

// Cancel trip
router.patch("/:id/cancel", authorizeRoles("Admin", "SuperAdmin"), cancelTripController);

export default router;
