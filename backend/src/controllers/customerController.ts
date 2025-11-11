import { Request, Response } from "express";
import {
  createCustomerService,
  getAllCustomersService,
  getCustomerByIdService,
  updateCustomerService,
  deleteCustomerService,
} from "../services/customerService.js";

/**
 * 🟢 Create Customer
 */
export const createCustomerController = async (req: Request, res: Response) => {
  try {
    const customer = await createCustomerService(req.body);
    res.status(201).json({ success: true, data: customer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🟢 Get All Customers
 */
export const getAllCustomersController = async (_req: Request, res: Response) => {
  try {
    const customers = await getAllCustomersService();
    res.status(200).json({ success: true, data: customers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🟢 Get Single Customer
 */
export const getCustomerByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const customer = await getCustomerByIdService(id);

    if (!customer)
      return res.status(404).json({ success: false, message: "Customer not found" });

    res.status(200).json({ success: true, data: customer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🟡 Update Customer
 */
export const updateCustomerController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const customer = await updateCustomerService(id, req.body);
    res.status(200).json({ success: true, data: customer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🔴 Delete Customer
 */
export const deleteCustomerController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteCustomerService(id);
    res.status(200).json({ success: true, message: "Customer deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
