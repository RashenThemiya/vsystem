import { Request, Response } from "express";
import { getDashboardKPIs } from "../services/dashboardservices.js";

/**
 * 🟢 Get Dashboard KPIs
 */
export const getDashboardKPIsController = async (_req: Request, res: Response) => {
  try {
    const kpis = await getDashboardKPIs();
    res.status(200).json({ success: true, data: kpis });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
