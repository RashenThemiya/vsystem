import { Request, Response } from "express";
import {
  createTripService,
  getAllTripsService,
  getTripByIdService,
  updateTripService,
  deleteTripService,
} from "../services/tripService";

/**
 * Create Trip
 */
export const createTripController = async (req: Request, res: Response) => {
  try {
    const trip = await createTripService(req.body);
    res.status(201).json({ success: true, data: trip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get All Trips
 */
export const getAllTripsController = async (_req: Request, res: Response) => {
  try {
    const trips = await getAllTripsService();
    res.status(200).json({ success: true, data: trips });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Trip by ID
 */
export const getTripByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const trip = await getTripByIdService(id);
    res.status(200).json({ success: true, data: trip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Trip
 */
export const updateTripController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const trip = await updateTripService(id, req.body);
    res.status(200).json({ success: true, data: trip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete Trip
 */
export const deleteTripController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteTripService(id);
    res.status(200).json({ success: true, message: "Trip deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
