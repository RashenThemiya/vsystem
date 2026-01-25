// src/services/tripCostCalculator.ts

import {
  Trip,
  Vehicle,
  Driver,
  Other_Trip_Cost,
} from "@prisma/client";

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

export const calculateActualTripCost = (
  trip: TripWithRelations,
  end_meter: number,
  actualReturnDate?: Date // ✅ optional parameter
): ActualCostResult => {
  const startMeter = trip.start_meter || 0;
  const actualDistance = end_meter - startMeter;

  const leavingDate = new Date(trip.leaving_datetime);

  const returnDate =
    actualReturnDate || trip.actual_return_datetime || new Date();

  const diff = Math.max(returnDate.getTime() - leavingDate.getTime(), 0);
  const actualDays = Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1);

  const numDays = actualDays;
  const distance = actualDistance;

  // Trip cost variables
  const vehicleDaily = Number(trip.vehicle.rent_cost_daily) || 0;
  const mileageCost = Number(trip.mileage_cost) || 0;
  const additionalMileageCost = Number(trip.additional_mileage_cost) || 0;
  const fuelCostPerLitre = Number(trip.fuel_cost) || 0;
  const fuelEfficiency = Number(trip.fuel_efficiency) || 0;
  const driverDailyCost =
  trip.driver_required === "Yes"
    ? Number(trip.driver_cost ?? trip.driver?.driver_charges ?? 0)
    : 0;
  const damageCost = Number(trip.damage_cost || 0);

  const otherCosts = (trip.other_trip_costs || []).reduce(
    (sum, cost) => sum + Number(cost.cost_amount || 0),
    0
  );

  // Fuel cost calculation
  const fuelCost =
    fuelEfficiency > 0 ? (distance / fuelEfficiency) * fuelCostPerLitre : 0;

  // Mileage calculations
  const defaultDistance = Math.min(numDays * 100, distance);
  const additionalDistance = Math.max(distance - numDays * 100, 0);
  const defaultDistanceCost = defaultDistance * mileageCost;
  const additionalDistanceCost = additionalDistance * additionalMileageCost;
  const driverCost = driverDailyCost * numDays;

  // Gross cost
  const grossTripAmount =
    vehicleDaily * numDays +
    defaultDistanceCost +
    additionalDistanceCost +
    driverCost +
    otherCosts;

  // Discount
  let discount = Number(trip.discount) || 0;
  if (discount > grossTripAmount) discount = grossTripAmount;

  const totalActualCost = grossTripAmount - discount + damageCost;
  const actualCosts = vehicleDaily * numDays + driverCost + otherCosts + fuelCost;
  const profit = grossTripAmount - actualCosts - discount;

  return {
    actualDistance,
    actualDays,
    totalActualCost,
    fuelCost,
    defaultDistanceCost,
    additionalDistanceCost,
    driverCost,
    otherCosts,
    discountApplied: discount,
    profit,
  };
};
