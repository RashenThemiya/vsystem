import { Trip, Vehicle, Driver, Other_Trip_Cost } from "@prisma/client";
export interface ActualCostResult {
    actualDistance: number;
    actualDays: number;
    totalActualCost: number;
    fuelCost: number;
    defaultDistanceCost: number;
    additionalDistanceCost: number;
    driverCost: number;
    otherCosts: number;
    discountApplied: number;
    profit: number;
}
export type TripWithRelations = Trip & {
    vehicle: Vehicle;
    driver: Driver | null;
    other_trip_costs: Other_Trip_Cost[];
};
export declare const calculateActualTripCost: (trip: TripWithRelations, end_meter: number, actualReturnDate?: Date) => ActualCostResult;
//# sourceMappingURL=tripCostCalculator.d.ts.map