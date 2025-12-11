import { createBillService, getAllBillsService, getBillByIdService, updateBillService, deleteBillService, } from "../services/billUploadService.js";
/**
 * ✅ Create a new bill
 */
export const createBillController = async (req, res) => {
    try {
        const bill = await createBillService(req.body);
        res.status(201).json({ success: true, data: bill });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * ✅ Get all bills
 */
export const getAllBillsController = async (_req, res) => {
    try {
        const bills = await getAllBillsService();
        res.status(200).json({ success: true, data: bills });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * ✅ Get bill by ID
 */
export const getBillByIdController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const bill = await getBillByIdService(id);
        if (!bill)
            return res.status(404).json({ success: false, message: "Bill not found" });
        res.status(200).json({ success: true, data: bill });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * ✅ Update bill by ID
 */
export const updateBillController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const bill = await updateBillService(id, req.body);
        res.status(200).json({ success: true, data: bill });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * ✅ Delete bill by ID
 */
export const deleteBillController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await deleteBillService(id);
        res.status(200).json({ success: true, message: "Bill deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//# sourceMappingURL=billUploadController.js.map