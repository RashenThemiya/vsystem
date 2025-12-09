import { prisma } from "../config/prismaClient";
import { Bill_Upload, BillStatus } from "@prisma/client";

/* ---------------------------------------------
   Helper Functions
----------------------------------------------*/

// Convert base64 → Buffer
const toBufferIfBase64 = (val: any) => {
  if (!val) return undefined;
  try {
    return Buffer.from(val, "base64");
  } catch {
    return undefined;
  }
};

// Convert Prisma Buffer to Base64
const toBase64 = (data: any): string | null => {
  if (!data) return null;

  if (Buffer.isBuffer(data)) {
    return data.toString("base64");
  }

  if (typeof data === "object" && Object.keys(data).length > 0) {
    try {
      const uint8Arr = Uint8Array.from(Object.values(data));
      return Buffer.from(uint8Arr).toString("base64");
    } catch {
      return null;
    }
  }

  return null;
};

// Types
type BillCreateInput = Omit<Bill_Upload, "bill_id"> & {
  vehicle_other_cost_id?: number | null;
};
type BillUpdateInput = Partial<BillCreateInput>;

/* ---------------------------------------------
   CREATE BILL
----------------------------------------------*/
export const createBillService = async (data: BillCreateInput) => {
  const bill = await prisma.bill_Upload.create({
    data: {
      vehicle_id: data.vehicle_id || undefined,
      driver_id: data.driver_id || undefined,
      bill_type: data.bill_type,
      bill_date: data.bill_date,
      bill_status: data.bill_status || BillStatus.pending,

      // ⭐ Convert base64 → Buffer
      bill_image: data.bill_image ? toBufferIfBase64(data.bill_image) : undefined,

      vehicle_other_cost: data.vehicle_other_cost_id
        ? { connect: { vehicle_other_cost_id: data.vehicle_other_cost_id } }
        : undefined,
    },
    include: {
      vehicle: true,
      driver: true,
      vehicle_other_cost: true,
    },
  });

  return bill;
};

/* ---------------------------------------------
   GET ALL BILLS (Convert buffer → base64)
----------------------------------------------*/
export const getAllBillsService = async () => {
  const bills = await prisma.bill_Upload.findMany({
    include: {

    },
  });

  // ⭐ Convert bill_image buffer → base64
  return bills.map((bill) => ({
    ...bill,
    bill_image: bill.bill_image ? `data:image/png;base64,${toBase64(bill.bill_image)}` : null,
  }));
};

/* ---------------------------------------------
   GET BILL BY ID  
----------------------------------------------*/
export const getBillByIdService = async (id: number) => {
  const bill = await prisma.bill_Upload.findUnique({
    where: { bill_id: id },
    include: {
    
    },
  });

  if (!bill) return null;

  return {
    ...bill,
    bill_image: bill.bill_image ? `data:image/png;base64,${toBase64(bill.bill_image)}` : null,
  };
};

/* ---------------------------------------------
   UPDATE BILL
----------------------------------------------*/
export const updateBillService = async (id: number, data: BillUpdateInput) => {
  const bill = await prisma.bill_Upload.update({
    where: { bill_id: id },
    data: {
      vehicle_id: data.vehicle_id ?? undefined,
      driver_id: data.driver_id ?? undefined,
      bill_type: data.bill_type ?? undefined,
      bill_date: data.bill_date ?? undefined,
      bill_status: data.bill_status ?? undefined,

      // ⭐ Convert base64 → Buffer
      bill_image: data.bill_image !== undefined ? toBufferIfBase64(data.bill_image) : undefined,

      vehicle_other_cost:
        data.vehicle_other_cost_id !== undefined
          ? data.vehicle_other_cost_id === null
            ? { disconnect: true }
            : { connect: { vehicle_other_cost_id: data.vehicle_other_cost_id } }
          : undefined,
    },

    include: {
      vehicle: true,
      driver: true,
      vehicle_other_cost: true,
    },
  });

  return {
    ...bill,
    bill_image: bill.bill_image ? `data:image/png;base64,${toBase64(bill.bill_image)}` : null,
  };
};

/* ---------------------------------------------
   DELETE BILL
----------------------------------------------*/
export const deleteBillService = async (id: number) => {
  await prisma.bill_Upload.delete({ where: { bill_id: id } });
  return true;
};
