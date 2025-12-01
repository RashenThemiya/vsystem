// src/services/tripService.ts
import { prisma } from "../config/prismaClient.js";
import { Prisma } from "@prisma/client";

interface EndTripDTO {
  end_meter: number;
}

export const endTripService = async (trip_id: number, data: EndTripDTO) => {
  const { end_meter } = data;

  // 1️⃣ Fetch trip with vehicle, driver, and other costs
  const trip = await prisma.trip.findUnique({
    where: { trip_id },
    include: {
      vehicle: true,
      driver: true,
      other_trip_costs: true,
    },
  });

  if (!trip) throw new Error("Trip not found");
  if (trip.trip_status !== "Ongoing") throw new Error("Only ongoing trips can be ended");
  if (end_meter < (trip.start_meter || 0)) throw new Error("End meter cannot be less than start meter");

  // 2️⃣ Calculate actual distance
  const actualDistance = end_meter - (trip.start_meter || 0);

  // 3️⃣ Set actual return date
  const actualReturnDate = new Date();

  // 4️⃣ Calculate actual days (always round up)
  const leavingDate = new Date(trip.leaving_datetime);
  const diffTime = Math.max(actualReturnDate.getTime() - leavingDate.getTime(), 0);
  const actualDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);

  // 5️⃣ Calculate total actual cost
  const numDays = actualDays;
  const distance = actualDistance;

  const vehicleDaily = Number(trip.vehicle.rent_cost_daily) || 0;
  const mileageCost = Number(trip.mileage_cost) || 0;
  const additionalMileageCost = Number(trip.additional_mileage_cost) || 0;
  const fuelCostPerLitre = Number(trip.fuel_cost) || 0;
  const fuelEfficiency = Number(trip.fuel_efficiency) || 0;
  const driverDailyCost = trip.driver_required === "Yes" ? Number(trip.driver?.driver_charges || 0) : 0;
  const damageCost = Number(trip.damage_cost) || 0;
  const otherCosts = (trip.other_trip_costs || []).reduce(
    (sum, c) => sum + Number(c.cost_amount || 0),
    0
  );

  const fuelCost = fuelEfficiency > 0 ? (distance / fuelEfficiency) * fuelCostPerLitre : 0;

  // Mileage calculations
  const defaultDistance = Math.min(numDays * 100, distance); // first 100km per day
  const additionalDistance = Math.max(distance - numDays * 100, 0);
  const defaultDistanceCost = defaultDistance * mileageCost;
  const additionalDistanceCost = additionalDistance * additionalMileageCost;
  const driverCost = driverDailyCost * numDays;

  // Gross amount before discount & damage
  const grossTripAmount =
    vehicleDaily * numDays + defaultDistanceCost + additionalDistanceCost + driverCost + otherCosts;

  // Apply discount and damage
  let discount = Number(trip.discount) || 0;
  if (discount > grossTripAmount) discount = grossTripAmount;
  const totalActualCost = grossTripAmount - discount - damageCost;

  // 6️⃣ Update trip with actual details
  const updatedTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      end_meter,
      actual_distance: new Prisma.Decimal(actualDistance),
      actual_return_datetime: actualReturnDate,
      actual_days: actualDays,
      total_actual_cost: new Prisma.Decimal(totalActualCost),
      trip_status: "Ended",
    },
  });

  // 7️⃣ Update vehicle meter to reflect current end_meter
  await prisma.vehicle.update({
    where: { vehicle_id: trip.vehicle_id },
    data: { meter_number: end_meter },
  });

  return updatedTrip;
};
