import { prisma } from "../config/prismaClient.js";
import { Owner } from "@prisma/client";

// ✅ Create new owner
export const createOwnerService = async (
  data: Pick<Owner, "owner_name" | "contact_number">
) => {
  if (!data.owner_name || !data.contact_number) {
    throw new Error("Missing required fields: owner_name and contact_number");
  }

  const owner = await prisma.owner.create({
    data,
  });

  return owner;
};

// ✅ Get all owners (with vehicles)
export const getAllOwnersService = async () => {
  return await prisma.owner.findMany({
    include: { vehicles: true }, // ✅ show linked vehicles
  });
};

// ✅ Get single owner by ID (with vehicles)
export const getOwnerByIdService = async (id: number) => {
  return await prisma.owner.findUnique({
    where: { owner_id: id },
    include: { vehicles: true },
  });
};

// ✅ Update owner
export const updateOwnerService = async (
  id: number,
  data: Partial<Pick<Owner, "owner_name" | "contact_number">>
) => {
  const updated = await prisma.owner.update({
    where: { owner_id: id },
    data,
  });

  return updated;
};

// ✅ Delete owner (optional: cascade or handle manually)
export const deleteOwnerService = async (id: number) => {
  await prisma.owner.delete({
    where: { owner_id: id },
  });
  return true;
};
