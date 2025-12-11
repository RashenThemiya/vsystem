import { Router } from "express";
import { register, login } from "../controllers/adminController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
const router = Router();
router.post("/register", authenticate, authorizeRoles("SuperAdmin"), register);
router.post("/login", login);
export default router;
//# sourceMappingURL=adminRoutes.js.map