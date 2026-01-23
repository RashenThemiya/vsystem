import { Router } from "express";
import multer from "multer";
import {
  createVehicleController,
  getAllVehiclesController,
  getVehicleByIdController,
  updateVehicleController,
  deleteVehicleController,
  getActiveVehiclesController, // 🆕 NEW
} from "../controllers/vehicleController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// -----------------------
// Multer setup
// -----------------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 10MB max per file
});

const vehicleFileFields = [
  { name: "image", maxCount: 1 },
  { name: "license_image", maxCount: 1 },
  { name: "insurance_card_image", maxCount: 1 },
  { name: "eco_test_image", maxCount: 1 },
  { name: "book_image", maxCount: 1 },
];

// -----------------------
// Protected routes
// -----------------------
router.use(authenticate);

// Get active vehicles
router.get(
  "/active",
  authorizeRoles("SuperAdmin", "Admin", "Manager", "Driver"),
  getActiveVehiclesController
);

// Create vehicle with files
router.post(
  "/",
  authorizeRoles("SuperAdmin"),
  upload.fields(vehicleFileFields),
  createVehicleController
);

// Get all vehicles
router.get(
  "/",
  authorizeRoles("SuperAdmin", "Admin", "Driver"),
  getAllVehiclesController
);

// Get single vehicle by ID
router.get(
  "/:id",
  authorizeRoles("SuperAdmin", "Admin", "Manager"),
  getVehicleByIdController
);

// Update vehicle with files
router.put(
  "/:id",
  authorizeRoles("SuperAdmin"),
  upload.fields(vehicleFileFields),
  updateVehicleController
);

// Delete vehicle
router.delete(
  "/:id",
  authorizeRoles("SuperAdmin"),
  deleteVehicleController
);

export default router;
