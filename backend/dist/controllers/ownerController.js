import { createOwnerService, getAllOwnersService, getOwnerByIdService, updateOwnerService, deleteOwnerService, } from "../services/ownerService.js";
export const createOwnerController = async (req, res) => {
    try {
        const owner = await createOwnerService(req.body);
        res.status(201).json({ success: true, data: owner });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllOwnersController = async (_req, res) => {
    try {
        const owners = await getAllOwnersService();
        res.status(200).json({ success: true, data: owners });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getOwnerByIdController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const owner = await getOwnerByIdService(id);
        if (!owner)
            return res.status(404).json({ success: false, message: "Owner not found" });
        res.status(200).json({ success: true, data: owner });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const updateOwnerController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const owner = await updateOwnerService(id, req.body);
        res.status(200).json({ success: true, data: owner });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteOwnerController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await deleteOwnerService(id);
        res.status(200).json({ success: true, message: "Owner deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//# sourceMappingURL=ownerController.js.map