import { createVehicleService, getAllVehiclesService, getVehicleByIdService, updateVehicleService, deleteVehicleService, getActiveVehiclesService, // 🆕 NEW
 } from "../services/vehicleService.js";
/**
 * ✅ Create a new vehicle
 */
export const createVehicleController = async (req, res) => {
    try {
        const data = req.body;
        if (!data.vehicle_number ||
            !data.name ||
            !data.type ||
            !data.ac_type ||
            !data.owner_id ||
            !data.fuel_id) {
            return res.status(400).json({ message: "Missing required vehicle fields" });
        }
        const newVehicle = await createVehicleService(data);
        return res.status(201).json({
            message: "✅ Vehicle created successfully",
            data: newVehicle,
        });
    }
    catch (error) {
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
export const getAllVehiclesController = async (_req, res) => {
    try {
        const vehicles = await getAllVehiclesService();
        return res.status(200).json(vehicles);
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to fetch vehicles",
            error: error.message || error,
        });
    }
};
export const getActiveVehiclesController = async (_req, res) => {
    try {
        const vehicles = await getActiveVehiclesService();
        return res.status(200).json(vehicles);
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to fetch vehicles",
            error: error.message || error,
        });
    }
};
/**
 * ✅ Get single vehicle with all related data
 */
export const getVehicleByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await getVehicleByIdService(Number(id));
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        return res.status(200).json(vehicle);
    }
    catch (error) {
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
export const updateVehicleController = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedVehicle = await updateVehicleService(Number(id), req.body);
        return res.status(200).json({
            message: "✅ Vehicle updated successfully",
            data: updatedVehicle,
        });
    }
    catch (error) {
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
export const deleteVehicleController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteVehicleService(Number(id));
        return res.status(200).json({
            message: "🚮 Vehicle deleted successfully",
            result,
        });
    }
    catch (error) {
        console.error("❌ Error deleting vehicle:", error);
        return res.status(400).json({
            message: "Failed to delete vehicle",
            error: error.message || error,
        });
    }
};
//# sourceMappingURL=vehicleController.js.map