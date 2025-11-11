// controllers/driverController.ts
import { Request, Response } from "express";
import {
  createDriverService,
  getAllDriversService,
  getDriverByIdService,
  updateDriverService,
  deleteDriverService,
} from "../services/driverService.js";

/**
 * 🟢 Create Driver
 */
export const createDriverController = async (req: Request, res: Response): Promise<void> => {
  try {
    const driver = await createDriverService(req.body);
    res.status(201).json({ success: true, data: driver });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🟢 Get All Drivers
 */
export const getAllDriversController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const drivers = await getAllDriversService();
    res.status(200).json({ success: true, data: drivers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🟢 Get Single Driver
 */
export const getDriverByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const driver = await getDriverByIdService(id);

    if (!driver) {
      res.status(404).json({ success: false, message: "Driver not found" });
      return;
    }

    res.status(200).json({ success: true, data: driver });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🟡 Update Driver
 */
export const updateDriverController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const driver = await updateDriverService(id, req.body);
    res.status(200).json({ success: true, data: driver });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🔴 Delete Driver
 */
export const deleteDriverController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    await deleteDriverService(id);
    res.status(200).json({ success: true, message: "Driver deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
