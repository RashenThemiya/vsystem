// src/routes/paymentRoutes.ts
import { Router } from "express";
import { deleteTripPaymentController } from "../controllers/paymentController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Add a payment to a trip

// Delete a payment by payment_id
router.delete("/:payment_id", authorizeRoles("Admin", "SuperAdmin"), deleteTripPaymentController);

export default router;
