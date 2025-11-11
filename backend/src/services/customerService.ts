import { prisma } from "../config/prismaClient.js";

/**
 * Helper: Convert base64 → Uint8Array<ArrayBuffer>
 */
const toPrismaBytes = (b64) => {
  if (!b64) return null;
  const buffer = Buffer.from(b64, "base64");
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
  return new Uint8Array(arrayBuffer);
};

/**
 * Helper: Convert Prisma Bytes → Base64 string
 */
const fromPrismaBytes = (bytes) => {
  if (!bytes) return null;
  return `data:image/png;base64,${Buffer.from(bytes).toString("base64")}`;
};

/**
 * ✅ Create a new customer
 */
export const createCustomerService = async (data) => {
  const { name, nic, phone_number, email, nic_photo_front, nic_photo_back } = data;

  if (!name || !nic || !phone_number || !email) {
    throw new Error("Missing required fields: name, nic, phone_number, email");
  }

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) throw new Error("Customer with this email already exists");

  return await prisma.customer.create({
    data: {
      name,
      nic,
      phone_number,
      email,
      nic_photo_front: toPrismaBytes(nic_photo_front),
      nic_photo_back: toPrismaBytes(nic_photo_back),
    },
  });
};

/**
 * ✅ Get all customers (convert Bytes → Base64)
 */

export const getAllCustomersService = async () => {
  const customers = await prisma.customer.findMany();

  return customers.map((c) => ({
    ...c,
    nic_photo_front: fromPrismaBytes(c.nic_photo_front),
    nic_photo_back: fromPrismaBytes(c.nic_photo_back),
  }));
};

/**
 * ✅ Get single customer by ID
 */
export const getCustomerByIdService = async (id) => {
  const customer = await prisma.customer.findUnique({
    where: { customer_id: id },
    include: { trips: true },
  });

  if (!customer) throw new Error("Customer not found");

  return {
    ...customer,
    nic_photo_front: fromPrismaBytes(customer.nic_photo_front),
    nic_photo_back: fromPrismaBytes(customer.nic_photo_back),
  };
};

/**
 * ✅ Update customer by ID
 */
export const updateCustomerService = async (id, data) => {
  const existing = await prisma.customer.findUnique({
    where: { customer_id: id },
  });

  if (!existing) throw new Error("Customer not found");

  const updateData = {
    name: data.name ?? existing.name,
    nic: data.nic ?? existing.nic,
    phone_number: data.phone_number ?? existing.phone_number,
    email: data.email ?? existing.email,
    nic_photo_front:
      data.nic_photo_front && data.nic_photo_front.startsWith("data:image")
        ? toPrismaBytes(data.nic_photo_front.split(",")[1])
        : undefined, // keep existing
    nic_photo_back:
      data.nic_photo_back && data.nic_photo_back.startsWith("data:image")
        ? toPrismaBytes(data.nic_photo_back.split(",")[1])
        : undefined, // keep existing
  };

  const updated = await prisma.customer.update({
    where: { customer_id: id },
    data: updateData,
  });

  return {
    ...updated,
    nic_photo_front: fromPrismaBytes(updated.nic_photo_front),
    nic_photo_back: fromPrismaBytes(updated.nic_photo_back),
  };
};


/**
 * ✅ Delete customer by ID
 */
export const deleteCustomerService = async (id) => {
  await prisma.customer.delete({ where: { customer_id: id } });
  return true;
};
