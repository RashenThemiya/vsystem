import * as adminService from "../services/adminService.js";
export const register = async (req, res) => {
    try {
        // Check if the authenticated user exists and is a SuperAdmin
        const user = req.user; // added by auth.middleware
        if (!user || user.role !== "SuperAdmin") {
            return res.status(403).json({ error: "Only SuperAdmin can register new admins" });
        }
        const { email, password, role } = req.body;
        // Optional: prevent creating SuperAdmin by normal SuperAdmin
        if (role === "SuperAdmin") {
            return res.status(403).json({ error: "Cannot create another SuperAdmin" });
        }
        const admin = await adminService.registerAdmin(email, password, role);
        res.status(201).json({
            message: `New ${role} account created successfully`,
            admin,
        });
    }
    catch (err) {
        console.error("Register error:", err);
        res.status(400).json({ error: err.message || "Registration failed" });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, admin } = await adminService.loginAdmin(email, password);
        res.json({ message: "Login successful", token, admin });
    }
    catch (err) {
        res.status(401).json({ error: err.message });
    }
};
//# sourceMappingURL=adminController.js.map