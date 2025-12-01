import { Request, Response } from "express";
import {
  createTripService,
  getAllTripsService,
  getTripByIdService,
  updateTripService,
  deleteTripService,
  startTripService,
} from "../services/tripService";

import {endTripService } from "./../services/endtripService";
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
export const startTripController = async (req: Request, res: Response) => {
  try {
    const trip_id = parseInt(req.params.id);
    const { start_meter } = req.body;

    if (start_meter === undefined)
      return res.status(400).json({ success: false, message: "start_meter is required" });

    const trip = await startTripService(trip_id, start_meter);
    res.status(200).json({ success: true, data: trip, message: "Trip started successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
/**
 * Get All Trips
 */
export const getAllTripsController = async (req: Request, res: Response) => {
  try {
    const { trip_status, start_date, end_date } = req.query;

    const trips = await getAllTripsService({
      trip_status: trip_status as string | undefined,
      start_date: start_date as string | undefined,
      end_date: end_date as string | undefined,
    });

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
export const endTripController = async (req: Request, res: Response) => {
  try {
    const trip_id = parseInt(req.params.id);
    const { end_meter } = req.body;

    if (end_meter === undefined) {
      return res.status(400).json({ success: false, message: "end_meter is required" });
    }

    const updatedTrip = await endTripService(trip_id, { end_meter });

    res.status(200).json({
      success: true,
      data: updatedTrip,
      message: "Trip ended successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};