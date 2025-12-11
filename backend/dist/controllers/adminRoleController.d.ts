import { Response } from "express";
import { RequestWithUser } from "../types/RequestWithUser";
/**
 * 🧩 Create Admin
 */
export declare const createAdminController: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * 📋 Get All Admins (driver & customer details only, exclude images)
 */
export declare const getAllAdminsController: (_req: RequestWithUser, res: Response) => Promise<void>;
/**
 * 🔍 Get Admin by ID (exclude images)
 */
export declare const getAdminByIdController: (req: RequestWithUser, res: Response) => Promise<void>;
/**
 * ✏️ Update Admin
 */
export declare const updateAdminController: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * ❌ Delete Admin
 */
export declare const deleteAdminController: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * 🚀 Get All Drivers & Customers Without Admins
 */
export declare const getAllUsersWithoutAdminController: (_req: RequestWithUser, res: Response) => Promise<void>;
//# sourceMappingURL=adminRoleController.d.ts.map