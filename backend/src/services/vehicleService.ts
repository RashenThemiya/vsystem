import { prisma } from "../config/prismaClient.js";
type AnyObj = Record<string, any>;

const toBufferIfBase64 = (val: any) => {
  if (val === null) return null;
  if (!val) return undefined;
  return Buffer.from(val, "base64");
};

/**
 * Create a new vehicle
 */
export const createVehicleService = async (data: any) => {
  return prisma.vehicle.create({
    data: {
      vehicle_number: data.vehicle_number,
      name: data.name,
      type: data.type,
      rent_cost_daily: data.rent_cost_daily ? Number(data.rent_cost_daily) : 0,
      fuel_id: Number(data.fuel_id),
      ac_type: data.ac_type,
      owner_cost_monthly: data.owner_cost_monthly ? Number(data.owner_cost_monthly) : 0,
      license_expiry_date: data.license_expiry_date
        ? new Date(data.license_expiry_date)
        : null,
      insurance_expiry_date: data.insurance_expiry_date
        ? new Date(data.insurance_expiry_date)
        : null,
      eco_test_expiry_date: data.eco_test_expiry_date
        ? new Date(data.eco_test_expiry_date)
        : null,
      vehicle_fuel_efficiency: data.vehicle_fuel_efficiency
        ? Number(data.vehicle_fuel_efficiency)
        : null,
      meter_number: data.meter_number ? Number(data.meter_number) : null,
      last_service_meter_number: data.last_service_meter_number
        ? Number(data.last_service_meter_number)
        : null,
      owner_id: data.owner_id ? Number(data.owner_id) : null,
      license_image: data.license_image ? Buffer.from(data.license_image, "base64") : null,
      insurance_card_image: data.insurance_card_image
        ? Buffer.from(data.insurance_card_image, "base64")
        : null,
      eco_test_image: data.eco_test_image
        ? Buffer.from(data.eco_test_image, "base64")
        : null,
      book_image: data.book_image ? Buffer.from(data.book_image, "base64") : null,
      image: data.image ? Buffer.from(data.image, "base64") : null,
      gps: data.gps_latitude && data.gps_longitude && data.tracker_id
        ? {
            create: {
              tracker_id: data.tracker_id,
              latitude: data.gps_latitude,
              longitude: data.gps_longitude,
              recorded_at: new Date(),
            },
          }
        : undefined,
      mileage_costs:
        data.mileage_cost && data.mileage_cost_additional
          ? {
              create: {
                mileage_cost: Number(data.mileage_cost),
                mileage_cost_additional: Number(data.mileage_cost_additional),
              },
            }
          : undefined,
    },
    include: {
    mileage_costs: true, // <-- include mileage costs in the returned object
    owner: true,
    fuel: true,
  },
  });
};

/**
 * Get all vehicles (no image data)
 */

/**
 * ✅ Get all vehicles with essential details and related data
 */export const getAllVehiclesService = async () => {
  return prisma.vehicle.findMany({
    select: {
      vehicle_id: true,
      vehicle_number: true,
      name: true,
      type: true,
      rent_cost_daily: true,
      ac_type: true,
      owner_cost_monthly: true,
      license_expiry_date: true,
      insurance_expiry_date: true,
      eco_test_expiry_date: true,
      vehicle_fuel_efficiency: true,
      meter_number: true,
      last_service_meter_number: true,
      vehicle_availability: true,

      // 👇 Owner details
      owner: {
        select: {
          owner_id: true,
          owner_name: true,
          contact_number: true,
        },
      },

      // 👇 Fuel details
      fuel: {
        select: {
          fuel_id: true,
          type: true,
          cost: true,
        },
      },

      // 👇 Full mileage cost details (not just count)
      mileage_costs: {
      select: {
        mileage_cost_id: true,
        mileage_cost: true,
        mileage_cost_additional: true,
        vehicle_id: true, // optional if needed
      },
      orderBy: { mileage_cost_id: "desc" }, // use primary key for ordering
},

      // 👇 Keep counts for other reference data
      _count: {
        select: {
          trips: true,
          bill_uploads: true,
        },
      },
    },
    orderBy: { vehicle_id: "desc" },
  });
};


/**
 * ✅ Get a single vehicle by ID with all related tables
 */
export const getVehicleByIdService = async (id: number) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { vehicle_id: id },
    include: {
      owner: true,
      fuel: true,
      gps: true,
      mileage_costs: true,
      vehicle_other_costs: true,
      bill_uploads: true,
      trips: {
        include: {
   
        },
      },
    },
  });

  if (!vehicle) return null;

  // Helper: convert binary-like data to base64
  const toBase64 = (data: any): string | null => {
    if (!data) return null;

    if (Buffer.isBuffer(data)) {
      return data.toString('base64');
    }

    // Prisma might return an object like { '0': 137, '1': 80, ... }
    if (typeof data === 'object' && Object.keys(data).length > 0) {
      try {
        const uint8Arr = Uint8Array.from(Object.values(data));
        return Buffer.from(uint8Arr).toString('base64');
      } catch {
        return null;
      }
    }

    return null;
  };

  // Convert image fields
  const imageFields = [
    'image',
    'license_image',
    'insurance_card_image',
    'eco_test_image',
    'book_image',
  ];

  for (const field of imageFields) {
    const base64 = toBase64(vehicle[field]);
    if (base64) {
      vehicle[field] = `data:image/png;base64,${base64}`;
    } else {
      vehicle[field] = null; // ensure frontend doesn't get unreadable object
    }
  }

  return vehicle;
};

/**
 * Update vehicle
 */



/**
 * Update a vehicle and related data (GPS, Mileage, Owner)

*/
export const updateVehicleService = async (id: number, data: AnyObj) => {
  const scalarUpdate: AnyObj = {};

  const maybeSetNumber = (k: string, cast = true) => {
    if (data[k] !== undefined) scalarUpdate[k] = cast ? Number(data[k]) : data[k];
  };

  // =========================
  // 1️⃣ Core vehicle updates
  // =========================
  if (data.vehicle_number !== undefined)
    scalarUpdate.vehicle_number = String(data.vehicle_number);

  if (data.name !== undefined)
    scalarUpdate.name = String(data.name);

  if (data.type !== undefined)
    scalarUpdate.type = data.type;

  maybeSetNumber("rent_cost_daily");

  if (data.fuel_id !== undefined)
    scalarUpdate.fuel_id = Number(data.fuel_id);

  if (data.ac_type !== undefined)
    scalarUpdate.ac_type = data.ac_type;

  maybeSetNumber("owner_cost_monthly");

  if (data.license_expiry_date !== undefined)
    scalarUpdate.license_expiry_date = data.license_expiry_date
      ? new Date(data.license_expiry_date)
      : null;

  if (data.insurance_expiry_date !== undefined)
    scalarUpdate.insurance_expiry_date = data.insurance_expiry_date
      ? new Date(data.insurance_expiry_date)
      : null;

  if (data.eco_test_expiry_date !== undefined)
    scalarUpdate.eco_test_expiry_date = data.eco_test_expiry_date
      ? new Date(data.eco_test_expiry_date)
      : null;

  if (data.vehicle_fuel_efficiency !== undefined)
    scalarUpdate.vehicle_fuel_efficiency =
      data.vehicle_fuel_efficiency !== null
        ? Number(data.vehicle_fuel_efficiency)
        : null;

  if (data.vehicle_availability !== undefined)
    scalarUpdate.vehicle_availability = data.vehicle_availability;

  if (data.meter_number !== undefined)
    scalarUpdate.meter_number =
      data.meter_number === null ? null : Number(data.meter_number);

  if (data.last_service_meter_number !== undefined)
    scalarUpdate.last_service_meter_number =
      data.last_service_meter_number === null
        ? null
        : Number(data.last_service_meter_number);

  if (data.owner_id !== undefined)
    scalarUpdate.owner_id =
      data.owner_id === null ? null : Number(data.owner_id);

  // =========================
  // 2️⃣ IMAGE HANDLING (SAFE)
  // =========================
  // ✅ Update ONLY if base64 string is provided
  // ❌ null / undefined → keep old image

  const imageFields = [
    "image",
    "license_image",
    "insurance_card_image",
    "eco_test_image",
    "book_image",
  ];

  for (const field of imageFields) {
    if (
      typeof data[field] === "string" &&
      data[field].trim() !== ""
    ) {
      scalarUpdate[field] = Buffer.from(data[field], "base64");
    }
  }

  // =========================
  // 3️⃣ Update main vehicle
  // =========================
  await prisma.vehicle.update({
    where: { vehicle_id: id },
    data: scalarUpdate,
  });

  // =========================
  // 4️⃣ GPS update or create
  // =========================
  if (
    data.tracker_id !== undefined ||
    data.gps_latitude !== undefined ||
    data.gps_longitude !== undefined
  ) {
    const existingGPS = await prisma.gPS.findFirst({
      where: { vehicle_id: id },
    });

    const gpsPayload: AnyObj = {
      recorded_at: new Date(),
    };

    if (data.tracker_id !== undefined)
      gpsPayload.tracker_id = String(data.tracker_id);

    if (data.gps_latitude !== undefined)
      gpsPayload.latitude = Number(data.gps_latitude);

    if (data.gps_longitude !== undefined)
      gpsPayload.longitude = Number(data.gps_longitude);

    if (existingGPS) {
      await prisma.gPS.update({
        where: { gps_id: existingGPS.gps_id },
        data: gpsPayload,
      });
    } else if (
      gpsPayload.tracker_id &&
      gpsPayload.latitude !== undefined &&
      gpsPayload.longitude !== undefined
    ) {
      await prisma.gPS.create({
        data: {
          tracker_id: gpsPayload.tracker_id,
          latitude: gpsPayload.latitude,
          longitude: gpsPayload.longitude,
          recorded_at: gpsPayload.recorded_at,
          vehicle_id: id,
        },
      });
    }
  }

  // =========================
  // 5️⃣ Mileage cost update
  // =========================
  if (
    data.mileage_cost !== undefined ||
    data.mileage_cost_additional !== undefined
  ) {
    const existingMileage = await prisma.mileage_Cost.findFirst({
      where: { vehicle_id: id },
    });

    const mileagePayload: AnyObj = {};

    if (data.mileage_cost !== undefined)
      mileagePayload.mileage_cost = Number(data.mileage_cost);

    if (data.mileage_cost_additional !== undefined)
      mileagePayload.mileage_cost_additional = Number(
        data.mileage_cost_additional
      );

    if (existingMileage) {
      await prisma.mileage_Cost.update({
        where: { mileage_cost_id: existingMileage.mileage_cost_id },
        data: mileagePayload,
      });
    } else {
      await prisma.mileage_Cost.create({
        data: {
          vehicle_id: id,
          mileage_cost: mileagePayload.mileage_cost ?? 0,
          mileage_cost_additional:
            mileagePayload.mileage_cost_additional ?? 0,
        },
      });
    }
  }

  // =========================
  // 6️⃣ Owner update (optional)
  // =========================
  if (data.owner?.owner_id) {
    const ownerPayload: AnyObj = {};

    if (data.owner.owner_name !== undefined)
      ownerPayload.owner_name = String(data.owner.owner_name);

    if (data.owner.contact_number !== undefined)
      ownerPayload.contact_number = String(data.owner.contact_number);

    if (Object.keys(ownerPayload).length > 0) {
      await prisma.owner.update({
        where: { owner_id: Number(data.owner.owner_id) },
        data: ownerPayload,
      });
    }
  }

  // =========================
  // 7️⃣ Return updated vehicle
  // =========================
  return prisma.vehicle.findUnique({
    where: { vehicle_id: id },
    include: {
      owner: true,
      fuel: true,
      gps: true,
      mileage_costs: true,
      vehicle_other_costs: true,
      bill_uploads: true,
      trips: {
        include: {
          customer: true,
          driver: true,
          payments: true,
          map: true,
          other_trip_costs: true,
        },
      },
    },
  });
};


/**
 * Delete vehicle and all related data (GPS, mileage, etc.)
 */
export const deleteVehicleService = async (id: number) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1️⃣ Check if the vehicle exists
      const vehicle = await tx.vehicle.findUnique({
        where: { vehicle_id: id },
        include: {
          gps: true,
          mileage_costs: true,
          owner: true,
          vehicle_other_costs: true,
          bill_uploads: true,
          trips: true,
        },
      });

      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      // 2️⃣ Delete related GPS records (if any)
      await tx.gPS.deleteMany({
        where: { vehicle_id: id },
      });

      // 3️⃣ Delete related mileage costs (if any)
      await tx.mileage_Cost.deleteMany({
        where: { vehicle_id: id },
      });

      // 4️⃣ Delete related other costs (if any)
      await tx.vehicle_Other_Cost.deleteMany({
        where: { vehicle_id: id },
      });

      // 5️⃣ Delete related bill uploads (if any)
      await tx.bill_Upload.deleteMany({
        where: { vehicle_id: id },
      });

      // 6️⃣ Delete related trips (if any)
      await tx.trip.deleteMany({
        where: { vehicle_id: id },
      });

      // 7️⃣ Finally, delete the vehicle itself
      await tx.vehicle.delete({
        where: { vehicle_id: id },
      });

      // 8️⃣ Optionally — delete owner if this is their only vehicle
      if (vehicle.owner) {
        const otherVehicles = await tx.vehicle.findMany({
          where: { owner_id: vehicle.owner.owner_id },
        });

        if (otherVehicles.length === 0) {
          await tx.owner.delete({
            where: { owner_id: vehicle.owner.owner_id },
          });
        }
      }

      return { message: "Vehicle and related data deleted successfully" };
    });
  } catch (error: any) {
    console.error("❌ Error deleting vehicle:", error);
    throw new Error(error.message || "Failed to delete vehicle");
  }
};
