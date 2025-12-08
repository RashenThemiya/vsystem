import { Request, Response } from "express";
import {
  createVehicleCostService,
  getAllVehicleCostsService,
  getVehicleCostByIdService,
  updateVehicleCostService,
  deleteVehicleCostService,
} from "../services/vehicleOtherCostService.js";

export const createVehicleCostController = async (req: Request, res: Response) => {
  try {
    const cost = await createVehicleCostService(req.body);
    res.status(201).json({ success: true, data: cost });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllVehicleCostsController = async (_req: Request, res: Response) => {
  try {
    const costs = await getAllVehicleCostsService();
    res.status(200).json({ success: true, data: costs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVehicleCostByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const cost = await getVehicleCostByIdService(id);
    if (!cost) return res.status(404).json({ success: false, message: "Cost not found" });
    res.status(200).json({ success: true, data: cost });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVehicleCostController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const cost = await updateVehicleCostService(id, req.body);
    res.status(200).json({ success: true, data: cost });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVehicleCostController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteVehicleCostService(id);
    res.status(200).json({ success: true, message: "Vehicle cost deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
