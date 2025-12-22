import { Request, Response } from "express";
import { getDashboardKPIs, getVehicleExpiryNotifications  } from "../services/dashboardservices.js";

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

export const getVehicleExpiryNotificationsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const notifications = await getVehicleExpiryNotifications();

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error: any) {
    console.error("Vehicle Expiry Notification Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle expiry notifications",
    });
  }
};