import { createFuelService, getAllFuelsService, getFuelByIdService, updateFuelService, deleteFuelService, } from "../services/fuelService.js";
/**
 * 🟢 Create Fuel
 */
export const createFuelController = async (req, res) => {
    try {
        const fuel = await createFuelService(req.body);
        res.status(201).json({ success: true, data: fuel });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * 🟢 Get All Fuels
 */
export const getAllFuelsController = async (_req, res) => {
    try {
        const fuels = await getAllFuelsService();
        res.status(200).json({ success: true, data: fuels });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * 🟢 Get Single Fuel by ID
 */
export const getFuelByIdController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const fuel = await getFuelByIdService(id);
        if (!fuel)
            return res.status(404).json({ success: false, message: "Fuel not found" });
        res.status(200).json({ success: true, data: fuel });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * 🟡 Update Fuel
 */
export const updateFuelController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const fuel = await updateFuelService(id, req.body);
        res.status(200).json({ success: true, data: fuel });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * 🔴 Delete Fuel
 */
export const deleteFuelController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await deleteFuelService(id);
        res.status(200).json({ success: true, message: "Fuel deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//# sourceMappingURL=fuelController.js.map