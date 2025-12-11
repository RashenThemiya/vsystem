import { createCustomerService, getAllCustomersService, getCustomerByIdService, updateCustomerService, deleteCustomerService, } from "../services/customerService.js";
/**
 * 🟢 Create Customer
 */
export const createCustomerController = async (req, res) => {
    try {
        const customer = await createCustomerService(req.body);
        res.status(201).json({ success: true, data: customer });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * 🟢 Get All Customers
 */
export const getAllCustomersController = async (_req, res) => {
    try {
        const customers = await getAllCustomersService();
        res.status(200).json({ success: true, data: customers });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * 🟢 Get Single Customer
 */
export const getCustomerByIdController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const customer = await getCustomerByIdService(id);
        if (!customer)
            return res.status(404).json({ success: false, message: "Customer not found" });
        res.status(200).json({ success: true, data: customer });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * 🟡 Update Customer
 */
export const updateCustomerController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const customer = await updateCustomerService(id, req.body);
        res.status(200).json({ success: true, data: customer });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * 🔴 Delete Customer
 */
export const deleteCustomerController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await deleteCustomerService(id);
        res.status(200).json({ success: true, message: "Customer deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//# sourceMappingURL=customerController.js.map