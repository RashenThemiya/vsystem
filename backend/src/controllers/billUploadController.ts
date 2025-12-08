import { Request, Response } from "express";
import {
  createBillService,
  getAllBillsService,
  getBillByIdService,
  updateBillService,
  deleteBillService,
} from "../services/billUploadService.js";

export const createBillController = async (req: Request, res: Response) => {
  try {
    const bill = await createBillService(req.body);
    res.status(201).json({ success: true, data: bill });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBillsController = async (_req: Request, res: Response) => {
  try {
    const bills = await getAllBillsService();
    res.status(200).json({ success: true, data: bills });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBillByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const bill = await getBillByIdService(id);
    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });
    res.status(200).json({ success: true, data: bill });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBillController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const bill = await updateBillService(id, req.body);
    res.status(200).json({ success: true, data: bill });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBillController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteBillService(id);
    res.status(200).json({ success: true, message: "Bill deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
