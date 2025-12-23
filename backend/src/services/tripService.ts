import { prisma } from "../config/prismaClient.js";
import { Prisma, Driver } from "@prisma/client";
import { TripStatus, PaymentStatus } from "@prisma/client";

// ==================== DTOs ====================
export interface MapLocationDTO {
  location_name: string;
  latitude: number;
  longitude: number;
  sequence?: number;
}

export interface OtherTripCostDTO {
  cost_type: "Meal" | "Accommodation" | "Driver_Accommodation" | "Driver_Meal" | "Other";
  cost: number;
}

export interface CreateTripDTO {
  customer_id: number;
  vehicle_id: number;
  from_location: string;
  to_location: string;
  up_down: "Up" | "Down" | "Both";
  estimated_distance?: number;
  actual_distance?: number;
  estimated_days?: number;
  actual_days?: number;
  driver_required?: "Yes" | "No";
  driver_id?: number;
  estimated_cost?: number;
  actual_cost?: number;
  mileage_cost?: number;
  fuel_required?: "Yes" | "No";
  num_passengers?: number;
  discount?: number;
  damage_cost?: number;
  payment_amount?: number;
  advance_payment?: number;
  start_meter?: number;
  end_meter?: number;
  total_estimated_cost?: number;
  profit?: number;
  total_actual_cost?: number;
  payment_status?: "Paid" | "Partially_Paid" | "Unpaid";
  trip_status?: "Pending" | "Ongoing" | "Ended" | "Completed" | "Cancelled";
  leaving_datetime?: Date | string;
  estimated_return_datetime?: Date | string;
  actual_return_datetime?: Date | string;
  map_locations?: MapLocationDTO[];
  other_trip_costs?: OtherTripCostDTO[];
}

export interface UpdateTripDTO extends Partial<CreateTripDTO> {}

// ========================= CREATE TRIP =========================
export const createTripService = async (data: CreateTripDTO) => {
  // 1️⃣ Fetch vehicle info including fuel and mileage
  const vehicle = await prisma.vehicle.findUnique({
    where: { vehicle_id: data.vehicle_id },
    include: { mileage_costs: true, fuel: true },
  });
  if (!vehicle) throw new Error("Vehicle not found");

  // 2️⃣ Fetch driver if provided
  let driver: Driver | null = null;
  if (data.driver_id) {
    driver = await prisma.driver.findUnique({ where: { driver_id: data.driver_id } });
    if (!driver) throw new Error("Driver not found");
  }

  // 3️⃣ Auto-fill new fields
  const auto = {
    vehicle_rent_daily: vehicle.rent_cost_daily,
    fuel_efficiency: vehicle.vehicle_fuel_efficiency ?? null,
    mileage_cost: vehicle.mileage_costs?.[0]?.mileage_cost ?? null,
    additional_mileage_cost: vehicle.mileage_costs?.[0]?.mileage_cost_additional ?? null,
    fuel_cost: vehicle.fuel?.cost ?? null,
    driver_cost: driver?.driver_charges ?? null,
  };

  // 4️⃣ Create the trip
  const trip = await prisma.trip.create({
    data: {
      customer_id: data.customer_id,
      vehicle_id: data.vehicle_id,
      from_location: data.from_location,
      to_location: data.to_location,
      up_down: data.up_down,

      // Auto-filled fields
      vehicle_rent_daily: auto.vehicle_rent_daily,
      fuel_efficiency: auto.fuel_efficiency,
      mileage_cost: auto.mileage_cost,
      additional_mileage_cost: auto.additional_mileage_cost,
      fuel_cost: auto.fuel_cost,
      driver_cost: auto.driver_cost,

      // Optional frontend data
      estimated_distance: data.estimated_distance !== undefined ? new Prisma.Decimal(data.estimated_distance) : null,
      actual_distance: data.actual_distance !== undefined ? new Prisma.Decimal(data.actual_distance) : null,
      estimated_days: data.estimated_days ?? null,
      actual_days: data.actual_days ?? null,
      driver_required: data.driver_required ?? "No",
      driver_id: data.driver_id ?? null,
      fuel_required: data.fuel_required ?? "No",
      num_passengers: data.num_passengers ?? null,
      discount: data.discount !== undefined ? new Prisma.Decimal(data.discount) : new Prisma.Decimal(0),
      damage_cost: data.damage_cost !== undefined ? new Prisma.Decimal(data.damage_cost) : null,
      payment_amount: data.payment_amount !== undefined ? new Prisma.Decimal(data.payment_amount) : null,
      advance_payment: data.advance_payment !== undefined ? new Prisma.Decimal(data.advance_payment) : null,
      start_meter: data.start_meter ?? null,
      end_meter: data.end_meter ?? null,
      total_estimated_cost: data.total_estimated_cost !== undefined ? new Prisma.Decimal(data.total_estimated_cost) : null,
      total_actual_cost: data.total_actual_cost !== undefined ? new Prisma.Decimal(data.total_actual_cost) : null,
      payment_status: data.payment_status ?? "Unpaid",
      trip_status: data.trip_status ?? "Pending",
      leaving_datetime: data.leaving_datetime ? new Date(data.leaving_datetime) : new Date(),
      estimated_return_datetime: data.estimated_return_datetime ? new Date(data.estimated_return_datetime) : null,
      actual_return_datetime: data.actual_return_datetime ? new Date(data.actual_return_datetime) : null,
      profit: data.profit !== undefined ? new Prisma.Decimal(data.profit) : null,


      // Map locations
      map: data.map_locations
        ? {
            create: data.map_locations.map((loc: MapLocationDTO, index) => ({
              location_name: loc.location_name,
              latitude: new Prisma.Decimal(loc.latitude),
              longitude: new Prisma.Decimal(loc.longitude),
              sequence: loc.sequence ?? index + 1,
            })),
          }
        : undefined,

      // Other trip costs
      other_trip_costs: data.other_trip_costs
        ? {
            create: data.other_trip_costs.map((cost: OtherTripCostDTO) => ({
              cost_type: cost.cost_type,
              cost_amount: new Prisma.Decimal(cost.cost),
            })),
          }
        : undefined,
    },
    include: { map: true, other_trip_costs: true },
  });
if (data.advance_payment) {
  await prisma.payment.create({
    data: {
      trip_id: trip.trip_id,
      amount: new Prisma.Decimal(data.advance_payment),
      payment_date: new Date(), // always a valid date
    },
  });
}

  return trip;
};

// ========================= UPDATE TRIP =========================
export const updateTripService = async (id: number, data: UpdateTripDTO) => {
  const updateData: any = {};

  const fields = [
    "customer_id",
    "vehicle_id",
    "from_location",
    "to_location",
    "up_down",
    "driver_required",
    "driver_id",
    "fuel_required",
    "num_passengers",
    "discount",
    "estimated_distance",
    "actual_distance",
    "estimated_days",
    "actual_days",
    "estimated_cost",
    "actual_cost",
    "mileage_cost",
    "damage_cost",
    "payment_amount",
    "advance_payment",
    "start_meter",
    "end_meter",
    "total_estimated_cost",
    "total_actual_cost",
  ];

  for (const key of fields) {
    if (data[key as keyof UpdateTripDTO] !== undefined) {
      updateData[key] = Number.isNaN(Number(data[key as keyof UpdateTripDTO]))
        ? data[key as keyof UpdateTripDTO]
        : Number(data[key as keyof UpdateTripDTO]);
    }
  }

  // Dates
  if (data.leaving_datetime) updateData.leaving_datetime = new Date(data.leaving_datetime);
  if (data.estimated_return_datetime)
    updateData.estimated_return_datetime = new Date(data.estimated_return_datetime);
  if (data.actual_return_datetime)
    updateData.actual_return_datetime = new Date(data.actual_return_datetime);

  // Status
  if (data.trip_status) updateData.trip_status = data.trip_status;
  if (data.payment_status) updateData.payment_status = data.payment_status;

  // Update main trip
  const trip = await prisma.trip.update({
    where: { trip_id: Number(id) },
    data: updateData,
  });

  // Update map locations
  if (Array.isArray(data.map_locations)) {
    await prisma.map.deleteMany({ where: { trip_id: trip.trip_id } });
    await prisma.map.createMany({
      data: data.map_locations.map((loc, index) => ({
        trip_id: trip.trip_id,
        location_name: loc.location_name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        sequence: loc.sequence ?? index + 1,
      })),
    });
  }

  // Update other trip costs
  if (Array.isArray(data.other_trip_costs)) {
    await prisma.other_Trip_Cost.deleteMany({ where: { trip_id: trip.trip_id } });
    await prisma.other_Trip_Cost.createMany({
      data: data.other_trip_costs.map((cost) => ({
        trip_id: trip.trip_id,
        cost_type: cost.cost_type,
        cost_amount: cost.cost,
      })),
    });
  }

  return trip;
};

// ========================= GET ALL TRIPS =========================
interface GetTripsFilter {
  trip_status?: string; // optional filter by status
  start_date?: string;  // ISO string, optional
  end_date?: string;    // ISO string, optional
}

export const getAllTripsService = async (filters?: GetTripsFilter) => {
  const where: any = {};

  // Filter by status
  if (filters?.trip_status) {
    where.trip_status = filters.trip_status;
  }

  // Filter by leaving date range
  if (filters?.start_date && filters?.end_date) {
    where.leaving_datetime = {
      gte: new Date(filters.start_date),
      lte: new Date(filters.end_date),
    };
  }

  return await prisma.trip.findMany({
    where,
    select: {
      trip_id: true,
      from_location: true,
      to_location: true,
      up_down: true,
      estimated_distance: true,
      actual_distance: true,
      estimated_days: true,
      actual_days: true,
      leaving_datetime: true,
      estimated_return_datetime: true,
      actual_return_datetime: true,
      driver_required: true,
      estimated_cost: true,
      actual_cost: true,
      mileage_cost: true,
      fuel_required: true,
      num_passengers: true,
      discount: true,
      damage_cost: true,
      payment_amount: true,
      advance_payment: true,
      start_meter: true,
      end_meter: true,
      total_estimated_cost: true,
      total_actual_cost: true,
      payment_status: true,
      trip_status: true,
      vehicle_rent_daily: true,
      fuel_efficiency: true,
      fuel_cost: true,
      driver_cost: true,
      additional_mileage_cost: true,
      created_at: true,

      // Map locations
      map: {
        select: {
          map_id: true,
          location_name: true,
          latitude: true,
          longitude: true,
          sequence: true,
        },
        orderBy: { sequence: "asc" },
      },

      // Customer without images
      customer: {
        select: {
          customer_id: true,
          name: true,
          phone_number: true,
          email: true,
          nic: true,
        },
      },

      // Vehicle without images
      vehicle: {
        select: {
          vehicle_id: true,
          vehicle_number: true,
          name: true,
          type: true,
          rent_cost_daily: true,
          fuel_id: true,
          ac_type: true,
          vehicle_fuel_efficiency: true,
          mileage_costs: {
            select: {
              mileage_cost_id: true,
              mileage_cost: true,
              mileage_cost_additional: true,
            },
          },
          fuel: {
            select: {
              fuel_id: true,
              type: true,
              cost: true,
            },
          },
        },
      },

      // Driver without images
      driver: {
        select: {
          driver_id: true,
          name: true,
          phone_number: true,
          driver_charges: true,
          nic: true,
          age: true,
          license_number: true,
          license_expiry_date: true,
        },
      },

      // Payments
      payments: {
        select: {
          payment_id: true,
          amount: true,
          payment_date: true,
        },
      },

      // Other trip costs
      other_trip_costs: {
        select: {
          trip_other_cost_id: true,
          cost_type: true,
          cost_amount: true,
        },
      },
    },
  });
};

// ========================= START TRIP =========================
export const startTripService = async (trip_id: number, start_meter: number) => {
  const trip = await prisma.trip.findUnique({ where: { trip_id } });
  if (!trip) throw new Error("Trip not found");
  if (trip.trip_status !== "Pending") throw new Error("Only pending trips can be started");

  // Update trip and vehicle meter
  const updatedTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      trip_status: "Ongoing",
      start_meter,
    },
  });

  await prisma.vehicle.update({
    where: { vehicle_id: trip.vehicle_id },
    data: { meter_number: start_meter },
  });

  return updatedTrip;
};
// ========================= GET SINGLE TRIP =========================
export const getTripByIdService = async (trip_id: number) => {
  const trip = await prisma.trip.findUnique({
    where: { trip_id },
    select: {
      // === Trip base fields (all needed fields) ===
      trip_id: true,
      map_id: true,
      customer_id: true,
      vehicle_id: true,
      from_location: true,
      to_location: true,
      up_down: true,
      estimated_distance: true,
      actual_distance: true,
      estimated_days: true,
      actual_days: true,
      leaving_datetime: true,
      estimated_return_datetime: true,
      actual_return_datetime: true,
      driver_required: true,
      driver_id: true,
      estimated_cost: true,
      actual_cost: true,
      mileage_cost: true,
      fuel_required: true,
      num_passengers: true,
      discount: true,
      damage_cost: true,
      payment_amount: true,
      advance_payment: true,
      start_meter: true,
      end_meter: true,
      total_estimated_cost: true,
      total_actual_cost: true,
      payment_status: true,
      trip_status: true,
      additional_mileage_cost: true,
      fuel_cost: true,
      driver_cost: true,
      vehicle_rent_daily: true,
      fuel_efficiency: true,
      created_at: true,
      profit: true,

      // === Map ===
      map: {
        orderBy: { sequence: "asc" },
      },

      // === Customer ===
      customer: {
        select: {
          customer_id: true,
          nic: true,
          name: true,
          phone_number: true,
          email: true,
          nic_photo_front: true,
          nic_photo_back: true,
          profile_photo: true,
        },
      },

      // === Driver ===
      driver: {
        select: {
          driver_id: true,
          name: true,
          phone_number: true,
          driver_charges: true,
          nic: true,
          age: true,
          license_number: true,
          license_expiry_date: true,
          image: true,        // KEEP ONLY THIS IMAGE
        },
      },

      // === Vehicle (ONLY needed fields) ===
      vehicle: {
        select: {
          vehicle_id: true,
          vehicle_number: true,
          name: true,
          type: true,
          rent_cost_daily: true,
          fuel_id: true,
          ac_type: true,
          owner_cost_monthly: true,
          license_expiry_date: true,
          insurance_expiry_date: true,
          eco_test_expiry_date: true,
          vehicle_fuel_efficiency: true,
          vehicle_availability: true,
          meter_number: true,
          last_service_meter_number: true,
          owner_id: true,

          // ONLY THIS IMAGE SHOULD BE FETCHED
          image: true,

          // ❌ DO NOT FETCH THESE:
          // license_image: false
          // insurance_card_image: false
          // eco_test_image: false
          // book_image: false
        },
      },

      // === Payments ===
      payments: true,

      // === Other trip costs ===
      other_trip_costs: true,
    },
  });

  if (!trip) throw new Error("Trip not found");

  const toBase64 = (bytes: Uint8Array | null) =>
    bytes ? Buffer.from(bytes).toString("base64") : null;

  return {
    ...trip,
    customer: trip.customer
      ? {
          ...trip.customer,
          nic_photo_front: toBase64(trip.customer.nic_photo_front),
          nic_photo_back: toBase64(trip.customer.nic_photo_back),
        }
      : null,

    driver: trip.driver
      ? {
          ...trip.driver,
          image: toBase64(trip.driver.image),
        }
      : null,

    vehicle: trip.vehicle
      ? {
          ...trip.vehicle,
          image: toBase64(trip.vehicle.image),
        }
      : null,
  };
};


// ========================= DELETE TRIP =========================
export const deleteTripService = async (trip_id: number) => {
  await prisma.map.deleteMany({ where: { trip_id } });
  await prisma.other_Trip_Cost.deleteMany({ where: { trip_id } });
  await prisma.trip.delete({ where: { trip_id } });
  return true;
};


export const completeTripService = async (trip_id: number) => {
  const trip = await prisma.trip.findUnique({
    where: { trip_id },
  });

  if (!trip) throw new Error("Trip not found");

  if (trip.trip_status !== TripStatus.Ended)
    throw new Error("Only trips with status 'Ended' can be completed");

  // ✅ Check full payment before completing
  if (trip.payment_status !== PaymentStatus.Paid)
    throw new Error("Cannot complete trip: full payment is not done");

  // Update trip to Completed
  const completedTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      trip_status: TripStatus.Completed,
      actual_return_datetime: new Date(), // mark completion time
    },
  });

  return completedTrip;
};


/**
 * Add a payment to a trip and update payment status automatically
 * @param trip_id - Trip ID
 * @param amount - Payment amount
 * @param payment_date - Optional payment date
 */
export const addTripPaymentService = async (
  trip_id: number,
  amount: number,
  payment_date?: Date | string
) => {
  // 1️⃣ Find the trip
  const trip = await prisma.trip.findUnique({
    where: { trip_id },
    select: { trip_id: true, total_actual_cost: true, payment_amount: true, payment_status: true },
  });

  if (!trip) throw new Error("Trip not found");

  // 2️⃣ Create new payment row
  const payment = await prisma.payment.create({
    data: {
      trip_id,
      amount: new Prisma.Decimal(amount),
      payment_date: payment_date ? new Date(payment_date) : new Date(),
    },
  });

  // 3️⃣ Calculate new total payment
  const newTotalPayment = (trip.payment_amount ?? new Prisma.Decimal(0)).plus(amount);

  // 4️⃣ Update payment status automatically
  let newPaymentStatus: PaymentStatus = PaymentStatus.Unpaid;
  if (trip.total_actual_cost !== null) {
    if (newTotalPayment.gte(trip.total_actual_cost)) {
      newPaymentStatus = PaymentStatus.Paid;
    } else if (newTotalPayment.gt(0)) {
      newPaymentStatus = PaymentStatus.Partially_Paid;
    }
  }

  // 5️⃣ Update trip with new payment info
  const updatedTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      payment_amount: newTotalPayment,
      payment_status: newPaymentStatus,
    },
  });

  return { payment, updatedTrip };
};

export const cancelTripService = async (trip_id: number) => {
  // 1️⃣ Fetch the trip
  const trip = await prisma.trip.findUnique({
    where: { trip_id },
    select: { trip_id: true, trip_status: true, payment_status: true },
  });

  if (!trip) throw new Error("Trip not found");

  // 2️⃣ Check if trip can be cancelled
  if (trip.trip_status === TripStatus.Completed || trip.trip_status === TripStatus.Cancelled) {
    throw new Error("Cannot cancel a completed or already cancelled trip");
  }

  // 3️⃣ Update trip status to Cancelled
  const cancelledTrip = await prisma.trip.update({
    where: { trip_id },
    data: {
      trip_status: TripStatus.Cancelled,
    },
  });

  return cancelledTrip;
};