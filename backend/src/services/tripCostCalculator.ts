// src/services/tripCostCalculator.ts

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

const DAY_MS = 1000 * 60 * 60 * 24;

function toValidDate(value: unknown, fallback: Date): Date {
  const d = value instanceof Date ? value : new Date(value as any);
  return isNaN(d.getTime()) ? fallback : d;
}

export const calculateActualTripCost = (
  trip: TripWithRelations,
  end_meter: number,
  actualReturnDate?: Date,
  daysOverride?: number // ✅ NEW
): ActualCostResult => {
  // ✅ meters
  const startMeter = trip.start_meter ?? 0;

  // ✅ prevent negative distance (extra safety)
  const actualDistance = Math.max(end_meter - startMeter, 0);

  // ✅ days (locked when override provided)
  let actualDays: number;

  if (Number.isInteger(daysOverride) && (daysOverride as number) > 0) {
    actualDays = daysOverride as number; // locked days (BEST for alter meter)
  } else {
    // ✅ safe date conversion (prevents Invalid Date -> NaN -> wrong days)
    const safeFallback = new Date(); // only used if both dates are invalid
    const leavingDate = toValidDate(trip.leaving_datetime, safeFallback);

    const returnDate = actualReturnDate
      ? toValidDate(actualReturnDate, safeFallback)
      : trip.actual_return_datetime
      ? toValidDate(trip.actual_return_datetime, safeFallback)
      : safeFallback;

    const diffMs = Math.max(returnDate.getTime() - leavingDate.getTime(), 0);
    actualDays = Math.max(Math.ceil(diffMs / DAY_MS), 1);
  }

  const numDays = actualDays;
  const distance = actualDistance;

  // =========================
  // Cost variables
  // =========================
  const vehicleDaily = Number(trip.vehicle.rent_cost_daily) || 0;
  const mileageCost = Number(trip.mileage_cost) || 0;
  const additionalMileageCost = Number(trip.additional_mileage_cost) || 0;

  // fuel cost per litre at trip time (stored in trip)
  const fuelCostPerLitre = Number(trip.fuel_cost) || 0;

  // ✅ fallback to vehicle efficiency if trip.fuel_efficiency missing
  const fuelEfficiency =
    Number(trip.fuel_efficiency ?? trip.vehicle.vehicle_fuel_efficiency) || 0;

  // driver daily
  const driverDailyCost =
    trip.driver_required === "Yes"
      ? Number(trip.driver_cost ?? trip.driver?.driver_charges ?? 0)
      : 0;

  // damage cost (added to payable total)
  const damageCost = Number(trip.damage_cost || 0);

  const otherCosts = (trip.other_trip_costs || []).reduce(
    (sum, cost) => sum + Number(cost.cost_amount || 0),
    0
  );

  // =========================
  // Fuel cost
  // =========================
  const fuelCost =
    fuelEfficiency > 0 ? (distance / fuelEfficiency) * fuelCostPerLitre : 0;

  // =========================
  // Mileage calculations
  // =========================
  const defaultDistance = Math.min(numDays * 100, distance);
  const additionalDistance = Math.max(distance - numDays * 100, 0);

  const defaultDistanceCost = defaultDistance * mileageCost;
  const additionalDistanceCost = additionalDistance * additionalMileageCost;

  const driverCost = driverDailyCost * numDays;

  // =========================
  // Gross amount (what customer pays before discount/damage)
  // =========================
  const grossTripAmount =
    vehicleDaily * numDays +
    defaultDistanceCost +
    additionalDistanceCost +
    driverCost +
    otherCosts;

  // Discount (cap to gross)
  let discount = Number(trip.discount) || 0;
  if (discount > grossTripAmount) discount = grossTripAmount;

  // ✅ total payable (customer)
  const totalActualCost = grossTripAmount - discount + damageCost;

  // ✅ internal costs (your business definition)
  // NOTE: fuelCost included here as internal cost
  const actualCosts =
    vehicleDaily * numDays + driverCost + otherCosts + fuelCost;

  // ✅ Profit (you said damageCost is NOT part of profit)
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
