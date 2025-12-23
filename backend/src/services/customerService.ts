import { prisma } from "../config/prismaClient.js";

interface CustomerInput {
  name: string;
  nic: string;
  phone_number: string;
  email: string;
  nic_photo_front?: string;
  nic_photo_back?: string;
  profile_photo?: string; // ✅ NEW
}

/**
 * Helper: Convert base64 → Prisma Bytes
 */
const toPrismaBytes = (b64?: string): Uint8Array<ArrayBuffer> | null => {
  if (!b64) return null;
  const buffer = Buffer.from(b64, "base64");
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
  return new Uint8Array(arrayBuffer);
};

/**
 * Helper: Convert Prisma Bytes → Base64
 */
const fromPrismaBytes = (bytes?: Uint8Array | null): string | null => {
  if (!bytes) return null;
  return `data:image/png;base64,${Buffer.from(bytes).toString("base64")}`;
};

const phoneRegex = /^(?:\+94|0)?7\d{8}$/;
const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;

/**
 * ✅ Create customer
 */
export const createCustomerService = async (data: CustomerInput) => {
  const {
    name,
    nic,
    phone_number,
    email,
    nic_photo_front,
    nic_photo_back,
    profile_photo,
  } = data;

  if (!name || !nic || !phone_number || !email) {
    throw new Error("Missing required fields");
  }

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) throw new Error("Customer with this email already exists");

  const newCustomer = await prisma.customer.create({
    data: {
      name,
      nic,
      phone_number,
      email,
      nic_photo_front: nic_photo_front
        ? toPrismaBytes(nic_photo_front.split(",")[1])
        : null,
      nic_photo_back: nic_photo_back
        ? toPrismaBytes(nic_photo_back.split(",")[1])
        : null,
      profile_photo: profile_photo
        ? toPrismaBytes(profile_photo.split(",")[1])
        : null,
    },
  });

  return {
    ...newCustomer,
    nic_photo_front: fromPrismaBytes(newCustomer.nic_photo_front),
    nic_photo_back: fromPrismaBytes(newCustomer.nic_photo_back),
    profile_photo: fromPrismaBytes(newCustomer.profile_photo),
  };
};

/**
 * ✅ Get all customers
 */
export const getAllCustomersService = async () => {
  const customers = await prisma.customer.findMany();

  return customers.map((c) => ({
    ...c,
    nic_photo_front: fromPrismaBytes(c.nic_photo_front),
    nic_photo_back: fromPrismaBytes(c.nic_photo_back),
    profile_photo: fromPrismaBytes(c.profile_photo),
  }));
};

/**
 * ✅ Get customer by ID
 */
export const getCustomerByIdService = async (id: number) => {
  const customer = await prisma.customer.findUnique({
    where: { customer_id: id },
    include: {
      trips: {
        include: {
          map: { orderBy: { sequence: "asc" } },
          payments: { orderBy: { payment_date: "asc" } },
        },
      },
    },
  });

  if (!customer) throw new Error("Customer not found");

  return {
    ...customer,
    nic_photo_front: fromPrismaBytes(customer.nic_photo_front),
    nic_photo_back: fromPrismaBytes(customer.nic_photo_back),
    profile_photo: fromPrismaBytes(customer.profile_photo),
  };
};

/**
 * ✅ Update customer
 */
export const updateCustomerService = async (
  id: number,
  data: Partial<CustomerInput>
) => {
  const existing = await prisma.customer.findUnique({
    where: { customer_id: id },
  });

  if (!existing) throw new Error("Customer not found");

  const updated = await prisma.customer.update({
    where: { customer_id: id },
    data: {
      name: data.name ?? existing.name,
      nic: data.nic ?? existing.nic,
      phone_number: data.phone_number ?? existing.phone_number,
      email: data.email ?? existing.email,

      nic_photo_front:
        data.nic_photo_front?.startsWith("data:image")
          ? toPrismaBytes(data.nic_photo_front.split(",")[1])
          : undefined,

      nic_photo_back:
        data.nic_photo_back?.startsWith("data:image")
          ? toPrismaBytes(data.nic_photo_back.split(",")[1])
          : undefined,

      profile_photo:
        data.profile_photo?.startsWith("data:image")
          ? toPrismaBytes(data.profile_photo.split(",")[1])
          : undefined,
    },
  });

  return {
    ...updated,
    nic_photo_front: fromPrismaBytes(updated.nic_photo_front),
    nic_photo_back: fromPrismaBytes(updated.nic_photo_back),
    profile_photo: fromPrismaBytes(updated.profile_photo),
  };
};

/**
 * ✅ Delete customer
 */
export const deleteCustomerService = async (id: number) => {
  await prisma.trip.deleteMany({ where: { customer_id: id } });
  await prisma.customer.delete({ where: { customer_id: id } });
  return true;
};

/**
 * ✅ Customer KPI
 */
export const getCustomerKpiService = async (customerId: number) => {
  const trips = await prisma.trip.findMany({
    where: { customer_id: customerId },
    select: { payment_status: true, trip_status: true },
  });

  const pieChart = { Paid: 0, Partially_Paid: 0, Unpaid: 0 };
  const barChart = {
    Pending: 0,
    Ongoing: 0,
    Ended: 0,
    Completed: 0,
    Cancelled: 0,
  };

  trips.forEach((t) => {
    pieChart[t.payment_status]++;
    barChart[t.trip_status]++;
  });

  return { pieChart, barChart };
};
