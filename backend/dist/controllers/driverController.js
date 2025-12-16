import { createDriverService, getAllDriversService, getDriverByIdService, updateDriverService, deleteDriverService, getDriverTripsByStatusService, getDriverDetailsOnlyService, } from "../services/driverService.js";
/**
 * 🟢 Create Driver
 */
export const createDriverController = async (req, res) => {
    try {
        const driver = await createDriverService(req.body);
        res.status(201).json({ success: true, data: driver });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * 🟢 Get All Drivers
 */
export const getAllDriversController = async (_req, res) => {
    try {
        const drivers = await getAllDriversService();
        res.status(200).json({ success: true, data: drivers });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * 🟢 Get Single Driver
 */
export const getDriverByIdController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const driver = await getDriverByIdService(id);
        if (!driver) {
            res.status(404).json({ success: false, message: "Driver not found" });
            return;
        }
        res.status(200).json({ success: true, data: driver });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * 🟡 Update Driver
 */
export const updateDriverController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const driver = await updateDriverService(id, req.body);
        res.status(200).json({ success: true, data: driver });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * 🔴 Delete Driver
 */
export const deleteDriverController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await deleteDriverService(id);
        res.status(200).json({ success: true, message: "Driver deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getDriverTripsByStatusController = async (req, res) => {
    try {
        const driverId = parseInt(req.params.id);
        const status = req.query.status;
        if (!driverId || !status) {
            res.status(400).json({
                success: false,
                message: "Driver ID and trip status are required",
            });
            return;
        }
        // Allow only required statuses
        if (!["Pending", "Ongoing"].includes(status)) {
            res.status(400).json({
                success: false,
                message: "Status must be Pending or Ongoing",
            });
            return;
        }
        const trips = await getDriverTripsByStatusService(driverId, status);
        res.status(200).json({
            success: true,
            data: trips,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const getDriverDetailsOnlyController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const driver = await getDriverDetailsOnlyService(id);
        res.status(200).json({
            success: true,
            data: driver,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
//# sourceMappingURL=driverController.js.map