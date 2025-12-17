import { Request, Response } from "express";
/**
 * 🟢 Create Customer
 */
export declare const createCustomerController: (req: Request, res: Response) => Promise<void>;
/**
 * 🟢 Get All Customers
 */
export declare const getAllCustomersController: (_req: Request, res: Response) => Promise<void>;
/**
 * 🟢 Get Single Customer
 */
export declare const getCustomerByIdController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * 🟡 Update Customer
 */
export declare const updateCustomerController: (req: Request, res: Response) => Promise<void>;
/**
 * 🔴 Delete Customer
 */
export declare const deleteCustomerController: (req: Request, res: Response) => Promise<void>;
export declare const getCustomerKpiController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=customerController.d.ts.map