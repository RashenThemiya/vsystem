import { Request, Response } from "express";
/**
 * ✅ Create a new bill
 */
export declare const createBillController: (req: Request, res: Response) => Promise<void>;
/**
 * ✅ Get all bills
 */
export declare const getAllBillsController: (_req: Request, res: Response) => Promise<void>;
/**
 * ✅ Get bill by ID
 */
export declare const getBillByIdController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * ✅ Update bill by ID
 */
export declare const updateBillController: (req: Request, res: Response) => Promise<void>;
/**
 * ✅ Delete bill by ID
 */
export declare const deleteBillController: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=billUploadController.d.ts.map