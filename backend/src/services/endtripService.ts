// src/services/tripService.ts

import { prisma } from "../config/prismaClient.js";
import { Prisma } from "@prisma/client";
import { calculateActualTripCost, TripWithRelations } from "./tripCostCalculator.js";
import { TripStatus, PaymentStatus } from "@prisma/client";
import * as dfnsTz from "date-fns-tz";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

// ========================= R2 CONFIG =========================
const s3 = new AWS.S3({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

const uploadToR2 = async (base64Image: string, fileNamePrefix = "trip-meter") => {
  if (!base64Image) return null;

  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(cleanBase64, "base64");
  const key = `${fileNamePrefix}-${uuidv4()}.png`;

  try {
    await s3
      .putObject({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: "image/png",
        ACL: "public-read",
      })
      .promise();

    return `${process.env.R2_PUBLIC_URL}/${key}`;
  } catch (err) {
    console.error("R2 Upload Error:", err);
    return null;
  }
};

export interface EndTripDTO {
  end_meter: number;
  end_meter_photo_base64?: string;
}

// ========================= END TRIP =========================
export const endTripService = async (trip_id: number, data: EndTripDTO) => {
  const { end_meter, end_meter_photo_base64 } = data;

  const trip = await prisma.trip.findUnique({
    where: { trip_id },
    include: {
      vehicle: true,
      driver: true,
      other_trip_costs: true,
    },
  });

  if (!trip) throw new Error("Trip not found");
  if (trip.trip_status !== TripStatus.Ongoing) {
    throw new Error("Only ongoing trips can be ended");
  }

  if (end_meter < (trip.start_meter || 0)) {
    throw new Error("End meter cannot be less than start meter");
  }

  let endMeterPhotoUrl: string | null = null;

  if (end_meter_photo_base64) {
    endMeterPhotoUrl = await uploadToR2(end_meter_photo_base64, "end-meter");
  }

  const stableReturnDate = new Date();

  const costData = calculateActualTripCost(
    trip as TripWithRelations,
    end_meter,
    stableReturnDate
  );

  const updatedTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      end_meter,
      end_meter_photo: endMeterPhotoUrl ?? undefined,
      actual_distance: new Prisma.Decimal(costData.actualDistance),
      actual_return_datetime: stableReturnDate,
      actual_days: costData.actualDays,
      total_actual_cost: new Prisma.Decimal(costData.totalActualCost),
      trip_status: TripStatus.Ended,
      profit: new Prisma.Decimal(costData.profit),
    },
  });

  await prisma.vehicle.update({
    where: { vehicle_id: trip.vehicle_id },
    data: { meter_number: end_meter },
  });

  return {
    ...updatedTrip,
    end_meter_photo: updatedTrip.end_meter_photo || null,
    cost_breakdown: costData,
  };
};


// ========================= ADD DAMAGE COST =========================
export const addDamageCostService = async (trip_id: number, damage_amount: number) => {
  if (damage_amount <= 0) throw new Error("Damage cost must be greater than zero");

  const trip = await prisma.trip.findUnique({
    where: { trip_id },
    include: {
      vehicle: true,
      driver: true,
      other_trip_costs: true,
    },
  });

  if (!trip) throw new Error("Trip not found");

  const tripForCalc: TripWithRelations = {
    ...(trip as TripWithRelations),
    damage_cost: new Prisma.Decimal(damage_amount),
  };

  const endMeter = trip.end_meter ?? trip.start_meter ?? 0;

  // ✅ For ended/completed trips, must have actual_return_datetime
  const stableReturnDate =
    trip.actual_return_datetime ?? trip.estimated_return_datetime ?? trip.leaving_datetime;

  // ✅ IMPORTANT: Use stored actual_days as fixed days (prevents 2 -> 3 jump)
  const fixedDays = trip.actual_days ?? 1;

  const costData = calculateActualTripCost(tripForCalc, endMeter, stableReturnDate, fixedDays);

  const newTotalCost = costData.totalActualCost;

  const paid = Number(trip.payment_amount || 0);

  let paymentStatus: PaymentStatus = PaymentStatus.Unpaid;
  if (paid >= newTotalCost) paymentStatus = PaymentStatus.Paid;
  else if (paid > 0) paymentStatus = PaymentStatus.Partially_Paid;

  const updatedTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      damage_cost: new Prisma.Decimal(damage_amount),
      total_actual_cost: new Prisma.Decimal(newTotalCost),
      // keep DB days consistent
      actual_days: fixedDays,
      profit: new Prisma.Decimal(costData.profit),
      payment_status: paymentStatus,
    },
  });

  return { ...updatedTrip, cost_breakdown: costData };
};

// ========================= UPDATE TRIP DATES =========================
export interface UpdateTripDatesDTO {
  leaving_datetime?: string | Date;
  actual_return_datetime?: string | Date;
  timezone?: string; // e.g., "Asia/Colombo"
}

export const updateTripDatesService = async (trip_id: number, data: UpdateTripDatesDTO) => {
  const trip = await prisma.trip.findUnique({
    where: { trip_id },
    include: {
      vehicle: true,
      driver: true,
      other_trip_costs: true,
    },
  });

  if (!trip) throw new Error("Trip not found");

  const timezone = data.timezone ?? "UTC";

  // ⚠️ Keep your existing conversion (works if input is local time without tz)
  const leavingDate = data.leaving_datetime
    ? dfnsTz.zonedTimeToUtc(data.leaving_datetime, timezone)
    : trip.leaving_datetime;

  const actualReturnDate = data.actual_return_datetime
    ? dfnsTz.zonedTimeToUtc(data.actual_return_datetime, timezone)
    : trip.actual_return_datetime ?? trip.estimated_return_datetime ?? new Date();

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

  // ✅ recompute days from edited dates (this is correct for Alter Dates)
  const diffTime = Math.max(actualReturnDate.getTime() - leavingDate.getTime(), 0);
  const actualDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);

  const endMeter = updatedTrip.end_meter ?? updatedTrip.start_meter ?? 0;

  const costData = calculateActualTripCost(
    updatedTrip as TripWithRelations,
    endMeter,
    actualReturnDate,
    actualDays // ✅ force same days used in calculation
  );

  const newTotalCost = costData.totalActualCost;

  const paid = Number(updatedTrip.payment_amount || 0);
  let paymentStatus: PaymentStatus = PaymentStatus.Unpaid;
  if (paid >= newTotalCost) paymentStatus = PaymentStatus.Paid;
  else if (paid > 0) paymentStatus = PaymentStatus.Partially_Paid;

  const finalTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      total_actual_cost: new Prisma.Decimal(newTotalCost),
      actual_days: actualDays,
      payment_status: paymentStatus,
      profit: new Prisma.Decimal(costData.profit),
    },
  });

  return { ...finalTrip, cost_breakdown: costData };
};

// ========================= UPDATE TRIP METER =========================
export interface UpdateTripMeterDTO {
  start_meter?: number;
  end_meter?: number;
}

export const updateTripMeterService = async (trip_id: number, data: UpdateTripMeterDTO) => {
  const trip = await prisma.trip.findUnique({
    where: { trip_id },
    include: {
      vehicle: true,
      driver: true,
      other_trip_costs: true,
    },
  });

  if (!trip) throw new Error("Trip not found");

  // ✅ Allow alter meters only after Ended/Completed
  if (trip.trip_status !== TripStatus.Ended && trip.trip_status !== TripStatus.Completed) {
    throw new Error("You can alter meters only after trip is ended or completed");
  }

  const newStartMeter = data.start_meter ?? trip.start_meter ?? 0;
  const newEndMeter = data.end_meter ?? trip.end_meter ?? trip.start_meter ?? 0;

  if (newEndMeter < newStartMeter) {
    throw new Error("End meter cannot be less than start meter");
  }

  const updatedTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      start_meter: newStartMeter,
      end_meter: newEndMeter,
      actual_distance: new Prisma.Decimal(newEndMeter - newStartMeter),
    },
    include: {
      vehicle: true,
      driver: true,
      other_trip_costs: true,
    },
  });

  // ✅ For Ended/Completed trips, MUST use actual_return_datetime
  if (!updatedTrip.actual_return_datetime) {
    throw new Error("Cannot alter meter: trip has no actual_return_datetime");
  }
  const stableReturnDate = updatedTrip.actual_return_datetime;

  // ✅ KEY FIX: Use stored actual_days so it NEVER jumps (2 -> 3)
  const fixedDays = updatedTrip.actual_days ?? 1;

  const costData = calculateActualTripCost(
    updatedTrip as TripWithRelations,
    newEndMeter,
    stableReturnDate,
    fixedDays
  );

  const paid = Number(updatedTrip.payment_amount || 0);
  let paymentStatus: PaymentStatus = PaymentStatus.Unpaid;
  if (paid >= costData.totalActualCost) paymentStatus = PaymentStatus.Paid;
  else if (paid > 0) paymentStatus = PaymentStatus.Partially_Paid;

  const finalTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      total_actual_cost: new Prisma.Decimal(costData.totalActualCost),
      actual_distance: new Prisma.Decimal(costData.actualDistance),
      actual_days: fixedDays, // ✅ keep consistent
      payment_status: paymentStatus,
      profit: new Prisma.Decimal(costData.profit),
    },
  });

  if (data.end_meter !== undefined) {
    await prisma.vehicle.update({
      where: { vehicle_id: trip.vehicle_id },
      data: { meter_number: newEndMeter },
    });
  }

  return { ...finalTrip, cost_breakdown: costData };
};


// ========================= UPDATE TRIP DRIVER COST =========================
export interface UpdateTripDriverCostDTO {
  driver_cost: number; // daily driver cost for this trip
}

export const updateTripDriverCostService = async (
  trip_id: number,
  data: UpdateTripDriverCostDTO
) => {
  const { driver_cost } = data;

  if (driver_cost < 0) throw new Error("Driver cost cannot be negative");

  const trip = await prisma.trip.findUnique({
    where: { trip_id },
    include: {
      vehicle: true,
      driver: true,
      other_trip_costs: true,
    },
  });

  if (!trip) throw new Error("Trip not found");

  // ✅ Allow altering driver cost only after Ended/Completed
  if (trip.trip_status !== TripStatus.Ended && trip.trip_status !== TripStatus.Completed) {
    throw new Error("You can alter driver cost only after trip is ended or completed");
  }

  // ✅ Must have actual_return_datetime for ended/completed recalculation
  if (!trip.actual_return_datetime) {
    throw new Error("Cannot alter driver cost: trip has no actual_return_datetime");
  }

  // ✅ Update driver_cost first
  const updatedTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      driver_cost: new Prisma.Decimal(driver_cost),
    },
    include: {
      vehicle: true,
      driver: true,
      other_trip_costs: true,
    },
  });

  // ✅ stable calculation inputs
  const endMeter = updatedTrip.end_meter ?? updatedTrip.start_meter ?? 0;

  // ✅ FIX: Prisma returns Date | null, but function expects Date | undefined
  const stableReturnDate: Date | undefined =
    updatedTrip.actual_return_datetime ?? undefined;

  // (extra safety - should never happen because we checked earlier)
  if (!stableReturnDate) {
    throw new Error("Cannot alter driver cost: actual_return_datetime missing");
  }

  // ✅ lock days (prevents 2 -> 3 jump)
  const fixedDays = updatedTrip.actual_days ?? 1;

  const costData = calculateActualTripCost(
    updatedTrip as TripWithRelations,
    endMeter,
    stableReturnDate,
    fixedDays
  );

  // ✅ payment status recalculation
  const paid = Number(updatedTrip.payment_amount || 0);

  let paymentStatus: PaymentStatus = PaymentStatus.Unpaid;
  if (paid >= costData.totalActualCost) paymentStatus = PaymentStatus.Paid;
  else if (paid > 0) paymentStatus = PaymentStatus.Partially_Paid;

  const finalTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      total_actual_cost: new Prisma.Decimal(costData.totalActualCost),
      actual_days: fixedDays,
      payment_status: paymentStatus,
      profit: new Prisma.Decimal(costData.profit),
    },
  });

  return { ...finalTrip, cost_breakdown: costData };
};