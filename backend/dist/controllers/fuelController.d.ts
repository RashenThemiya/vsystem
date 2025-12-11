import { Request, Response } from "express";
/**
 * 🟢 Create Fuel
 */
export declare const createFuelController: (req: Request, res: Response) => Promise<void>;
/**
 * 🟢 Get All Fuels
 */
export declare const getAllFuelsController: (_req: Request, res: Response) => Promise<void>;
/**
 * 🟢 Get Single Fuel by ID
 */
export declare const getFuelByIdController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * 🟡 Update Fuel
 */
export declare const updateFuelController: (req: Request, res: Response) => Promise<void>;
/**
 * 🔴 Delete Fuel
 */
export declare const deleteFuelController: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=fuelController.d.ts.map