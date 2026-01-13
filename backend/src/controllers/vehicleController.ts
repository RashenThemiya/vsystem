import { Request, Response } from "express";
import {
  createVehicleService,
  getAllVehiclesService,
  getVehicleByIdService,
  updateVehicleService,
  deleteVehicleService,
  getActiveVehiclesService, // 🆕 NEW

} from "../services/vehicleService.js";
import { Multer } from "multer";

/**
 * ✅ Create a new vehicle
 */

export const createVehicleController = async (req: Request, res: Response) => {
  try {
    const files = req.files as
      | Record<string, Express.Multer.File[]>
      | undefined;

    const data = {
      ...req.body,

      image: files?.image?.[0]?.buffer,
      license_image: files?.license_image?.[0]?.buffer,
      insurance_card_image: files?.insurance_card_image?.[0]?.buffer,
      eco_test_image: files?.eco_test_image?.[0]?.buffer,
      book_image: files?.book_image?.[0]?.buffer,
    };

    if (
      !data.vehicle_number ||
      !data.name ||
      !data.type ||
      !data.ac_type ||
      !data.owner_id ||
      !data.fuel_id
    ) {
      return res.status(400).json({
        message: "Missing required vehicle fields",
      });
    }

    const newVehicle = await createVehicleService(data);

    return res.status(201).json({
      message: "✅ Vehicle created successfully",
      data: newVehicle,
    });
  } catch (error: any) {
    console.error("❌ Error creating vehicle:", error);
    return res.status(400).json({
      message: "Failed to create vehicle",
      error: error.message || error,
    });
  }
};

/**
 * ✅ Get all vehicles (without heavy image data)
 */
export const getAllVehiclesController = async (_req: Request, res: Response) => {
  try {
    const vehicles = await getAllVehiclesService();
    return res.status(200).json(vehicles);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch vehicles",
      error: error.message || error,
    });
  }
};


export const getActiveVehiclesController = async (_req: Request, res: Response) => {
  try {
    const vehicles = await getActiveVehiclesService();
    return res.status(200).json(vehicles);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch vehicles",
      error: error.message || error,
    });
  }
  
};


/**
 * ✅ Get single vehicle with all related data
 */
export const getVehicleByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vehicle = await getVehicleByIdService(Number(id));

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    return res.status(200).json(vehicle);
  } catch (error: any) {
    console.error("❌ Error fetching vehicle:", error);
    return res.status(500).json({
      message: "Failed to fetch vehicle details",
      error: error.message || error,
    });
  }
};

/**
 * ✅ Update vehicle and related data (GPS, mileage, owner)
 */
export const updateVehicleController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vehicleId = Number(id);

    if (isNaN(vehicleId)) {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    // Handle uploaded files (Multer)
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;

    const data = {
      ...req.body,
      image: files?.image?.[0]?.buffer,
      license_image: files?.license_image?.[0]?.buffer,
      insurance_card_image: files?.insurance_card_image?.[0]?.buffer,
      eco_test_image: files?.eco_test_image?.[0]?.buffer,
      book_image: files?.book_image?.[0]?.buffer,
    };

    const updatedVehicle = await updateVehicleService(vehicleId, data);

    return res.status(200).json({
      message: "✅ Vehicle updated successfully",
      data: updatedVehicle,
    });
  } catch (error: any) {
    console.error("❌ Error updating vehicle:", error);
    return res.status(400).json({
      message: "Failed to update vehicle",
      error: error.message || error,
    });
  }
};
/**
 * ✅ Delete vehicle and all related records (GPS, mileage, etc.)
 */
export const deleteVehicleController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteVehicleService(Number(id));

    return res.status(200).json({
      message: "🚮 Vehicle deleted successfully",
      result,
    });
  } catch (error: any) {
    console.error("❌ Error deleting vehicle:", error);
    return res.status(400).json({
      message: "Failed to delete vehicle",
      error: error.message || error,
    });
  }
};
