import { prisma } from "../config/prismaClient";
import { Bill_Upload, BillStatus } from "@prisma/client";

type BillCreateInput = Omit<Bill_Upload, "bill_id">;
type BillUpdateInput = Partial<BillCreateInput>;

export const createBillService = async (data: BillCreateInput) => {
  const bill = await prisma.bill_Upload.create({
    data: {
      vehicle_id: data.vehicle_id,
      driver_id: data.driver_id,
      bill_type: data.bill_type,
      bill_date: data.bill_date,
      bill_status: data.bill_status || "pending",
      bill_image: data.bill_image,
    },
  });
  return bill;
};

export const getAllBillsService = async () => {
  return await prisma.bill_Upload.findMany({
    include: { vehicle: true, driver: true },
  });
};

export const getBillByIdService = async (id: number) => {
  return await prisma.bill_Upload.findUnique({
    where: { bill_id: id },
    include: { vehicle: true, driver: true },
  });
};

export const updateBillService = async (id: number, data: BillUpdateInput) => {
  return await prisma.bill_Upload.update({
    where: { bill_id: id },
    data: {
      vehicle_id: data.vehicle_id,
      driver_id: data.driver_id,
      bill_type: data.bill_type,
      bill_date: data.bill_date,
      bill_status: data.bill_status,
      bill_image: data.bill_image,
    },
  });
};

export const deleteBillService = async (id: number) => {
  await prisma.bill_Upload.delete({ where: { bill_id: id } });
  return true;
};
