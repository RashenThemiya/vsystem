import { prisma } from "../config/prismaClient.js";

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
  const trip = await prisma.trip.create({
    data: {
      customer_id: data.customer_id,
      vehicle_id: data.vehicle_id,
      from_location: data.from_location,
      to_location: data.to_location,
      up_down: data.up_down,
      estimated_distance: data.estimated_distance ?? null,
      actual_distance: data.actual_distance ?? null,
      estimated_days: data.estimated_days ?? null,
      actual_days: data.actual_days ?? null,
      driver_required: data.driver_required ?? "No",
      driver_id: data.driver_id ?? null,
      estimated_cost: data.estimated_cost ?? null,
      actual_cost: data.actual_cost ?? null,
      mileage_cost: data.mileage_cost ?? null,
      fuel_required: data.fuel_required ?? "No",
      num_passengers: data.num_passengers ?? null,
      discount: data.discount ?? 0,
      damage_cost: data.damage_cost ?? null,
      payment_amount: data.payment_amount ?? null,
      advance_payment: data.advance_payment ?? null,
      start_meter: data.start_meter ?? null,
      end_meter: data.end_meter ?? null,
      total_estimated_cost: data.total_estimated_cost ?? null,
      total_actual_cost: data.total_actual_cost ?? null,
      payment_status: data.payment_status ?? "Unpaid",
      trip_status: data.trip_status ?? "Pending",
      leaving_datetime: data.leaving_datetime ? new Date(data.leaving_datetime) : new Date(),
      estimated_return_datetime: data.estimated_return_datetime
        ? new Date(data.estimated_return_datetime)
        : null,
      actual_return_datetime: data.actual_return_datetime
        ? new Date(data.actual_return_datetime)
        : null,

      // Map locations
      map: data.map_locations
        ? {
            create: data.map_locations.map((loc, index) => ({
              location_name: loc.location_name,
              latitude: loc.latitude,
              longitude: loc.longitude,
              sequence: loc.sequence ?? index + 1,
            })),
          }
        : undefined,

      // Other trip costs
      other_trip_costs: data.other_trip_costs
        ? {
            create: data.other_trip_costs.map((cost) => ({
              cost_type: cost.cost_type,
              cost_amount: cost.cost,
            })),
          }
        : undefined,
    },
    include: { map: true, other_trip_costs: true },
  });

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
export const getAllTripsService = async () => {
  return await prisma.trip.findMany({
    include: {
      map: { orderBy: { sequence: "asc" } },
      customer: true,
      vehicle: true,
      driver: true,
      payments: true,
      other_trip_costs: true,
    },
  });
};

// ========================= GET SINGLE TRIP =========================
export const getTripByIdService = async (trip_id: number) => {
  const trip = await prisma.trip.findUnique({
    where: { trip_id },
    include: {
      map: { orderBy: { sequence: "asc" } },
      customer: true,
      vehicle: true,
      driver: true,
      payments: true,
      other_trip_costs: true,
    },
  });

  if (!trip) throw new Error("Trip not found");
  return trip;
};

// ========================= DELETE TRIP =========================
export const deleteTripService = async (trip_id: number) => {
  await prisma.map.deleteMany({ where: { trip_id } });
  await prisma.other_Trip_Cost.deleteMany({ where: { trip_id } });
  await prisma.trip.delete({ where: { trip_id } });
  return true;
};
