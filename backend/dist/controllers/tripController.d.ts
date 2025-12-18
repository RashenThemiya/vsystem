import { Request, Response } from "express";
/**
 * Create Trip
 */
export declare const createTripController: (req: Request, res: Response, next: unknown) => Promise<void>;
export declare const startTripController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get All Trips
 */
export declare const getAllTripsController: (req: Request, res: Response) => Promise<void>;
/**
 * Get Trip by ID
 */
export declare const getTripByIdController: (req: Request, res: Response) => Promise<void>;
/**
 * Update Trip
 */
export declare const updateTripController: (req: Request, res: Response) => Promise<void>;
/**
 * Delete Trip
 */
export declare const deleteTripController: (req: Request, res: Response) => Promise<void>;
export declare const endTripController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addDamageCostController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addTripPaymentController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTripDatesController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTripMeterController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Complete Trip (Only when status = Ended and payment is fully Paid)
 */
export declare const completeTripController: (req: Request, res: Response) => Promise<void>;
/** ---------------- CANCEL TRIP ---------------- */
export declare const cancelTripController: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=tripController.d.ts.map