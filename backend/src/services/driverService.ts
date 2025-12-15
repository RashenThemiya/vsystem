// services/driverService.ts
import { prisma } from "../config/prismaClient.js";
import { TripStatus } from "@prisma/client";

interface DriverInput {
  name: string;
  phone_number: string;
  driver_charges: number;
  nic: string;
  image?: string;
  age: number;
  license_number: string;
  license_expiry_date: string;
}

/**
 * ✅ Helper: Convert base64 → Uint8Array<ArrayBuffer>
 */
const toPrismaBytes = (b64?: string): Uint8Array<ArrayBuffer> | null => {
  if (!b64) return null;
  const buffer = Buffer.from(b64, "base64");

  // Force cast to ArrayBuffer to match Prisma type
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;

  return new Uint8Array(arrayBuffer);
};

/**
 * ✅ Helper: Convert Prisma Bytes → Base64 string
 */
const fromPrismaBytes = (bytes?: Uint8Array | null): string | null => {
  if (!bytes) return null;
  return `data:image/png;base64,${Buffer.from(bytes).toString("base64")}`;
};

/**
 * ✅ Create new driver
 */
const phoneRegex = /^(?:\+94|0)?7\d{8}$/; 
const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;

export const createDriverService = async (data: DriverInput) => {
  const {
    name,
    phone_number,
    driver_charges,
    nic,
    image,
    age,
    license_number,
    license_expiry_date,
  } = data;

  if (!name || !phone_number || !driver_charges || !nic || !age || !license_number || !license_expiry_date) {
    throw new Error("Missing required fields");
  }

  // Phone validation
  {/*if (!phoneRegex.test(phone_number)) {
    throw new Error("Phone number must be 10 digits");
  }

  // NIC validation
  if (!nicRegex.test(nic)) {
    throw new Error("NIC must be 9 digits + V/v/X/x or 12 digits");
  }*/}

  const existing = await prisma.driver.findUnique({ where: { nic } });
  if (existing) throw new Error("Driver with this NIC already exists");

  const newDriver = await prisma.driver.create({
    data: {
      name,
      phone_number,
      driver_charges,
      nic,
      age,
      license_number,
      license_expiry_date: new Date(license_expiry_date),
      image: image ? toPrismaBytes(image.split(",")[1]) : null,
    },
  });

  return {
    ...newDriver,
    image: fromPrismaBytes(newDriver.image),
  };
};

/**
 * ✅ Get all drivers (with base64 images)
 */
export const getAllDriversService = async () => {
  const drivers = await prisma.driver.findMany({
    
  });

  return drivers.map((d) => ({
    ...d,
    image: fromPrismaBytes(d.image),
  }));
};

/**
 * ✅ Get driver by ID
 */
export const getDriverByIdService = async (id: number) => {
  const driver = await prisma.driver.findUnique({
    where: { driver_id: id },
    include: {
      trips: true,
      bill_uploads: true,
    },
  });

  if (!driver) throw new Error("Driver not found");

  return {
    ...driver,
    image: fromPrismaBytes(driver.image),
  };
};

/**
 * ✅ Update driver
 */
export const updateDriverService = async (id: number, data: Partial<DriverInput>) => {
  const existing = await prisma.driver.findUnique({
    where: { driver_id: id },
  });

  if (!existing) throw new Error("Driver not found");

   //  Validate phone only if user tries to update it
  {/*if (data.phone_number && !phoneRegex.test(data.phone_number)) {
    throw new Error("Phone number must be 10 digits");
  }

  //  Validate NIC only if user updates it
  if (data.nic && !nicRegex.test(data.nic)) {
    throw new Error("NIC must be 9 digits + V/v/X/x or 12 digits");
  }*/}

  const updateData: any = {
    name: data.name ?? existing.name,
    phone_number: data.phone_number ?? existing.phone_number,
    driver_charges: data.driver_charges ?? existing.driver_charges,
    nic: data.nic ?? existing.nic,
    age: data.age ?? existing.age,
    license_number: data.license_number ?? existing.license_number,
    license_expiry_date: data.license_expiry_date
      ? new Date(data.license_expiry_date)
      : existing.license_expiry_date,
    image:
      data.image && data.image.startsWith("data:image")
        ? toPrismaBytes(data.image.split(",")[1])
        : undefined,
  };

  const updated = await prisma.driver.update({
    where: { driver_id: id },
    data: updateData,
  });

  return {
    ...updated,
    image: fromPrismaBytes(updated.image),
  };
};

/**
 * ✅ Delete driver
 */
export const deleteDriverService = async (id: number): Promise<boolean> => {
  await prisma.driver.delete({ where: { driver_id: id } });
  return true;
};

export const getDriverTripsByStatusService = async (
  driverId: number,
  status: TripStatus
) => {
  return prisma.trip.findMany({
    where: {
      driver_id: driverId,
      trip_status: status,
    },
    orderBy: {
      created_at: "desc",
    },
    select: {
      trip_id: true,
      from_location: true,
      to_location: true,
      leaving_datetime: true,
      estimated_return_datetime: true,
      actual_return_datetime: true,
      trip_status: true,
      payment_status: true,
      total_estimated_cost: true,
      total_actual_cost: true,
      created_at: true,

      // ✅ Customer (NO NIC images)
      customer: {
        select: {
          customer_id: true,
          name: true,
          phone_number: true,
          email: true,
        },
      },

      // ✅ Vehicle (NO images)
      vehicle: {
        select: {
          vehicle_id: true,
          vehicle_number: true,
          name: true,
          type: true,
        },
      },
    },
  });
};

export const getDriverDetailsOnlyService = async (id: number) => {
  const driver = await prisma.driver.findUnique({
    where: { driver_id: id },
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
  });

  if (!driver) throw new Error("Driver not found");

  return driver;
};