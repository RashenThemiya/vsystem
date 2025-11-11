import { Response } from "express";
import { RequestWithUser } from "../types/RequestWithUser";
import { Role } from "@prisma/client";
import {
  createAdminService,
  getAllAdminsService,
  getAdminByIdService,
  updateAdminService,
  deleteAdminService,
  getAllUsersWithoutAdminService,
} from "../services/adminRoleService";

/**
 * 🧩 Create Admin
 */
export const createAdminController = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const performedBy = {
      user_id: req.user.id,
      role: req.user.role as Role,
    };

    const admin = await createAdminService(req.body, performedBy);
    res.status(201).json({ success: true, data: admin });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 📋 Get All Admins (driver & customer details only, exclude images)
 */
export const getAllAdminsController = async (_req: RequestWithUser, res: Response) => {
  try {
    const admins = await getAllAdminsService();
    res.status(200).json({ success: true, data: admins });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 🔍 Get Admin by ID (exclude images)
 */
export const getAdminByIdController = async (req: RequestWithUser, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const admin = await getAdminByIdService(id);
    res.status(200).json({ success: true, data: admin });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

/**
 * ✏️ Update Admin
 */
export const updateAdminController = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const id = parseInt(req.params.id, 10);
    const performedBy = {
      user_id: req.user.id,
      role: req.user.role as Role,
    };

    const updatedAdmin = await updateAdminService(id, req.body, performedBy);
    res.status(200).json({ success: true, data: updatedAdmin });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * ❌ Delete Admin
 */
export const deleteAdminController = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const id = parseInt(req.params.id, 10);
    const performedBy = {
      user_id: req.user.id,
      role: req.user.role as Role,
    };

    await deleteAdminService(id, performedBy);
    res.status(200).json({ success: true, message: "Admin deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 🚀 Get All Drivers & Customers Without Admins
 */
export const getAllUsersWithoutAdminController = async (_req: RequestWithUser, res: Response) => {
  try {
    const users = await getAllUsersWithoutAdminService();
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
