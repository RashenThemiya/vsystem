import { Request, Response } from "express";
/**
 * ✅ Create a new vehicle
 */
export declare const createVehicleController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * ✅ Get all vehicles (without heavy image data)
 */
export declare const getAllVehiclesController: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getActiveVehiclesController: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * ✅ Get single vehicle with all related data
 */
export declare const getVehicleByIdController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * ✅ Update vehicle and related data (GPS, mileage, owner)
 */
export declare const updateVehicleController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * ✅ Delete vehicle and all related records (GPS, mileage, etc.)
 */
export declare const deleteVehicleController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=vehicleController.d.ts.map