// src/services/tripService.ts

import { prisma } from "../config/prismaClient.js";
import { Prisma } from "@prisma/client";
import { calculateActualTripCost, TripWithRelations } from "./tripCostCalculator.js";
import { TripStatus, PaymentStatus } from "@prisma/client";

export interface EndTripDTO {
  end_meter: number;
}

export const endTripService = async (trip_id: number, data: EndTripDTO) => {
  const { end_meter } = data;

  // Fetch trip with relations
  const trip = await prisma.trip.findUnique({
    where: { trip_id },
    include: {
      vehicle: true,
      driver: true,
      other_trip_costs: true,
    },
  });

  if (!trip) throw new Error("Trip not found");
  if (trip.trip_status !== "Ongoing")
    throw new Error("Only ongoing trips can be ended");

  if (end_meter < (trip.start_meter || 0))
    throw new Error("End meter cannot be less than start meter");

  // Calculate actual cost using helper
  const costData = calculateActualTripCost(
    trip as TripWithRelations,
    end_meter
  );

  // Update trip
  const updatedTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      end_meter,
      actual_distance: new Prisma.Decimal(costData.actualDistance),
      actual_return_datetime: new Date(),
      actual_days: costData.actualDays,
      total_actual_cost: new Prisma.Decimal(costData.totalActualCost),
      trip_status: "Ended",
      profit: new Prisma.Decimal(costData.profit),
    },
  });

  // Update vehicle meter
  await prisma.vehicle.update({
    where: { vehicle_id: trip.vehicle_id },
    data: {
      meter_number: end_meter,
    },
  });

  return {
    ...updatedTrip,
    cost_breakdown: costData,
  };
};

export const addDamageCostService = async (
  trip_id: number,
  damage_amount: number
) => {
  if (damage_amount <= 0)
    throw new Error("Damage cost must be greater than zero");

  // 1️⃣ Fetch trip
  const trip = await prisma.trip.findUnique({
    where: { trip_id },
    include: {
      vehicle: true,
      driver: true,
      other_trip_costs: true,
    },
  });

  if (!trip) throw new Error("Trip not found");

  // 2️⃣ Convert all numeric fields to number safely
  const currentDamage = Number(trip.damage_cost || 0);
  const newDamageCostNumber = damage_amount;

  // 3️⃣ Build trip object for calculation (correct Decimal type)
  const tripForCalc: TripWithRelations = {
    ...trip,
    damage_cost: new Prisma.Decimal(newDamageCostNumber),
  };

  // Need actual distance & days for calculation
  const actualDistance = Number(trip.actual_distance || 0);
  const actualDays = Number(trip.actual_days || 1);

  // 4️⃣ Recalculate cost
  const costData = calculateActualTripCost(
    tripForCalc,
    trip.end_meter ?? trip.start_meter ?? 0
  );

  const newTotalCost = costData.totalActualCost;

  // 5️⃣ Recalculate payment status
  const paid = Number(trip.payment_amount || 0);

  let paymentStatus: PaymentStatus = PaymentStatus.Unpaid;
  if (paid >= newTotalCost) paymentStatus = PaymentStatus.Paid;
  else if (paid > 0) paymentStatus = PaymentStatus.Partially_Paid;

  // 6️⃣ Update DB
  const updatedTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      damage_cost: new Prisma.Decimal(newDamageCostNumber),
      total_actual_cost: new Prisma.Decimal(newTotalCost),
      profit: new Prisma.Decimal(costData.profit),
      payment_status: paymentStatus,

    },
  });

  return {
    ...updatedTrip,
    cost_breakdown: costData,
  };
};

export interface UpdateTripDatesDTO {
  leaving_datetime?: string | Date;
  actual_return_datetime?: string | Date;
}

export const updateTripDatesService = async (
  trip_id: number,
  data: UpdateTripDatesDTO
) => {
  // 1️⃣ Fetch trip with relations
  const trip = await prisma.trip.findUnique({
    where: { trip_id },
    include: {
      vehicle: true,
      driver: true,
      other_trip_costs: true,
    },
  });

  if (!trip) throw new Error("Trip not found");

  // 2️⃣ Update leaving and actual return dates
  const leavingDate = data.leaving_datetime
    ? new Date(data.leaving_datetime)
    : trip.leaving_datetime;

  const actualReturnDate = data.actual_return_datetime
    ? new Date(data.actual_return_datetime)
    : trip.actual_return_datetime ?? new Date();

  const updatedTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      leaving_datetime: leavingDate,
      actual_return_datetime: actualReturnDate,

    },
    include: {
      vehicle: true,
      driver: true,
      other_trip_costs: true,
    },
  });

  // 3️⃣ Recalculate actual days
  const diffTime = Math.max(actualReturnDate.getTime() - leavingDate.getTime(), 0);
  const actualDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);

  // 4️⃣ Prepare trip object for calculation
  const tripForCalc: TripWithRelations = {
    ...updatedTrip,
    actual_days: actualDays,
    damage_cost: new Prisma.Decimal(Number(updatedTrip.damage_cost || 0)),
    actual_distance: updatedTrip.actual_distance
      ? new Prisma.Decimal(Number(updatedTrip.actual_distance))
      : new Prisma.Decimal(0),
    vehicle: {
      ...updatedTrip.vehicle,
      rent_cost_daily: new Prisma.Decimal(Number(updatedTrip.vehicle.rent_cost_daily)),
    },
    driver: updatedTrip.driver
      ? {
          ...updatedTrip.driver,
          driver_charges: new Prisma.Decimal(Number(updatedTrip.driver.driver_charges)),
        }
      : null, // ensure null instead of undefined
  };

  // 5️⃣ Recalculate total actual cost
  const costData = calculateActualTripCost(
    tripForCalc,
    updatedTrip.end_meter ?? updatedTrip.start_meter ?? 0
  );

  const newTotalCost = costData.totalActualCost;

  // 6️⃣ Recalculate payment status
  const paid = Number(updatedTrip.payment_amount || 0);

  let paymentStatus: PaymentStatus = PaymentStatus.Unpaid;
  if (paid >= newTotalCost) paymentStatus = PaymentStatus.Paid;
  else if (paid > 0) paymentStatus = PaymentStatus.Partially_Paid;

  // 7️⃣ Update trip with recalculated cost and payment status
  const finalTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      total_actual_cost: new Prisma.Decimal(newTotalCost),
      actual_days: actualDays,
      payment_status: paymentStatus,
      profit: new Prisma.Decimal(costData.profit),
      
      
    },
  });

  return {
    ...finalTrip,
    cost_breakdown: costData,
  };
};

export interface UpdateTripMeterDTO {
  start_meter?: number;
  end_meter?: number;
}

export const updateTripMeterService = async (
  trip_id: number,
  data: UpdateTripMeterDTO
) => {
  const trip = await prisma.trip.findUnique({
    where: { trip_id },
    include: {
      vehicle: true,
      driver: true,
      other_trip_costs: true,
    },
  });

  if (!trip) throw new Error("Trip not found");

  const newStartMeter = data.start_meter ?? trip.start_meter ?? 0;
  const newEndMeter = data.end_meter ?? trip.end_meter ?? trip.start_meter ?? 0;

  if (newEndMeter < newStartMeter)
    throw new Error("End meter cannot be less than start meter");

  // 1️⃣ Update trip meters in DB first
  const updatedTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      start_meter: newStartMeter,
      end_meter: newEndMeter,
    },
    include: {
      vehicle: true,
      driver: true,
      other_trip_costs: true,
    },
  });

  // 2️⃣ Prepare trip object for cost calculation
  const tripForCalc: TripWithRelations = {
    ...updatedTrip,
    actual_distance: new Prisma.Decimal(newEndMeter - newStartMeter),
    actual_days: updatedTrip.actual_days ?? 1,
    damage_cost: new Prisma.Decimal(Number(updatedTrip.damage_cost || 0)),
    vehicle: {
      ...updatedTrip.vehicle,
      rent_cost_daily: new Prisma.Decimal(Number(updatedTrip.vehicle.rent_cost_daily)),
    },
    driver: updatedTrip.driver
      ? {
          ...updatedTrip.driver,
          driver_charges: new Prisma.Decimal(Number(updatedTrip.driver.driver_charges)),
        }
      : null,
  };

  // 3️⃣ Recalculate total cost
  const costData = calculateActualTripCost(tripForCalc, newEndMeter);

  // 4️⃣ Recalculate payment status
  const paid = Number(updatedTrip.payment_amount || 0);
  let paymentStatus: PaymentStatus = PaymentStatus.Unpaid;
  if (paid >= costData.totalActualCost) paymentStatus = PaymentStatus.Paid;
  else if (paid > 0) paymentStatus = PaymentStatus.Partially_Paid;

  // 5️⃣ Update DB with recalculated cost and payment status
  const finalTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      total_actual_cost: new Prisma.Decimal(costData.totalActualCost),
      actual_distance: new Prisma.Decimal(costData.actualDistance),
      payment_status: paymentStatus,
      profit: new Prisma.Decimal(costData.profit),
    },
  });

  // 6️⃣ Update vehicle meter if end_meter changed
  if (data.end_meter !== undefined) {
    await prisma.vehicle.update({
      where: { vehicle_id: trip.vehicle_id },
      data: { meter_number: newEndMeter },
    });
  }

  return {
    ...finalTrip,
    cost_breakdown: costData,
  };
};