import { Request, Response } from "express";
import {
  createTripService,
  getAllTripsService,
  getTripByIdService,
  updateTripService,
  deleteTripService,
  startTripService,
  addTripPaymentService,
  cancelTripService,
} from "../services/tripService.js";
import AsyncLock from "async-lock";


import {endTripService } from "./../services/endtripService.js";
import { updateTripDatesService, UpdateTripDatesDTO } from "../services/endtripService.js";

import { addDamageCostService ,updateTripMeterService } from "../services/endtripService.js"; 
import { completeTripService } from "../services/tripService.js"; 
const lock = new AsyncLock();

/**
 * Create Trip
 */
export const createTripController = async (req: Request, res: Response, next: unknown) => {
  try {
    await lock.acquire("createTrip", async () => {
      const trip = await createTripService(req.body);
      res.status(201).json({ success: true, data: trip });
    });
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

export const addDamageCostController = async (req: Request, res: Response) => {
  try {
    const trip_id = parseInt(req.params.id);
    const { damage_amount } = req.body;

    if (damage_amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "damage_amount is required",
      });
    }

    const updatedTrip = await addDamageCostService(trip_id, Number(damage_amount));

    res.status(200).json({
      success: true,
      data: updatedTrip,
      message: "Damage cost added successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addTripPaymentController = async (req: Request, res: Response) => {
  try {
    const trip_id = parseInt(req.params.id);
    const { amount, payment_date } = req.body;

    if (amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Payment amount is required",
      });
    }

    const result = await addTripPaymentService(trip_id, amount, payment_date);

    res.status(201).json({
      success: true,
      message: "Payment added successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTripDatesController = async (req: Request, res: Response) => {
  try {
    const trip_id = parseInt(req.params.id);
    const data: UpdateTripDatesDTO = req.body;

    if (!data.leaving_datetime && !data.actual_return_datetime) {
      return res.status(400).json({
        success: false,
        message: "At least one of leaving_datetime or actual_return_datetime is required",
      });
    }

    const updatedTrip = await updateTripDatesService(trip_id, data);

    res.status(200).json({
      success: true,
      data: updatedTrip,
      message: "Trip dates updated successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTripMeterController = async (req: Request, res: Response) => {
  try {
    const trip_id = parseInt(req.params.id);
    const { start_meter, end_meter } = req.body;

    if (start_meter === undefined && end_meter === undefined) {
      return res.status(400).json({
        success: false,
        message: "At least start_meter or end_meter must be provided",
      });
    }

    const updatedTrip = await updateTripMeterService(trip_id, { start_meter, end_meter });

    res.status(200).json({
      success: true,
      data: updatedTrip,
      message: "Trip meters updated and cost recalculated",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Complete Trip (Only when status = Ended and payment is fully Paid)
 */
export const completeTripController = async (req: Request, res: Response) => {
  try {
    const trip_id = parseInt(req.params.id);

    const completedTrip = await completeTripService(trip_id);

    res.status(200).json({
      success: true,
      message: "Trip marked as COMPLETED successfully",
      data: completedTrip,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
/** ---------------- CANCEL TRIP ---------------- */
export const cancelTripController = async (req: Request, res: Response) => {
  try {
    const trip_id = parseInt(req.params.id);
    const cancelledTrip = await cancelTripService(trip_id);

    res.status(200).json({
      success: true,
      message: "Trip cancelled successfully",
      data: cancelledTrip,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};