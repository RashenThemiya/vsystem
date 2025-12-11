import { createAdminService, getAllAdminsService, getAdminByIdService, updateAdminService, deleteAdminService, getAllUsersWithoutAdminService, } from "../services/adminRoleService.js";
/**
 * 🧩 Create Admin
 */
export const createAdminController = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const performedBy = {
            user_id: req.user.id,
            role: req.user.role,
        };
        const admin = await createAdminService(req.body, performedBy);
        res.status(201).json({ success: true, data: admin });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
/**
 * 📋 Get All Admins (driver & customer details only, exclude images)
 */
export const getAllAdminsController = async (_req, res) => {
    try {
        const admins = await getAllAdminsService();
        res.status(200).json({ success: true, data: admins });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
/**
 * 🔍 Get Admin by ID (exclude images)
 */
export const getAdminByIdController = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const admin = await getAdminByIdService(id);
        res.status(200).json({ success: true, data: admin });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
/**
 * ✏️ Update Admin
 */
export const updateAdminController = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const id = parseInt(req.params.id, 10);
        const performedBy = {
            user_id: req.user.id,
            role: req.user.role,
        };
        const updatedAdmin = await updateAdminService(id, req.body, performedBy);
        res.status(200).json({ success: true, data: updatedAdmin });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
/**
 * ❌ Delete Admin
 */
export const deleteAdminController = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const id = parseInt(req.params.id, 10);
        const performedBy = {
            user_id: req.user.id,
            role: req.user.role,
        };
        await deleteAdminService(id, performedBy);
        res.status(200).json({ success: true, message: "Admin deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
/**
 * 🚀 Get All Drivers & Customers Without Admins
 */
export const getAllUsersWithoutAdminController = async (_req, res) => {
    try {
        const users = await getAllUsersWithoutAdminService();
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
//# sourceMappingURL=adminRoleController.js.map