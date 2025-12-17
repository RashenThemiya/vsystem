import { Request, Response } from "express";
import { deletePaymentService } from "../services/paymentService.js";

export const deleteTripPaymentController = async (req: Request, res: Response) => {
  try {
    const payment_id = parseInt(req.params.payment_id);
    if (!payment_id) {
      return res.status(400).json({ success: false, message: "Payment ID is required" });
    }

    const result = await deletePaymentService(payment_id);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.updatedTrip,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};