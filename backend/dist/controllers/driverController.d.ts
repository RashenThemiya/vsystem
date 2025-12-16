import { Request, Response } from "express";
/**
 * 🟢 Create Driver
 */
export declare const createDriverController: (req: Request, res: Response) => Promise<void>;
/**
 * 🟢 Get All Drivers
 */
export declare const getAllDriversController: (_req: Request, res: Response) => Promise<void>;
/**
 * 🟢 Get Single Driver
 */
export declare const getDriverByIdController: (req: Request, res: Response) => Promise<void>;
/**
 * 🟡 Update Driver
 */
export declare const updateDriverController: (req: Request, res: Response) => Promise<void>;
/**
 * 🔴 Delete Driver
 */
export declare const deleteDriverController: (req: Request, res: Response) => Promise<void>;
export declare const getDriverTripsByStatusController: (req: Request, res: Response) => Promise<void>;
export declare const getDriverDetailsOnlyController: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=driverController.d.ts.map