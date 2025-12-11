import { prisma } from "../config/prismaClient.js";
import { Bill_Upload, BillStatus } from "@prisma/client";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

// ----------------- R2 CONFIGURATION -----------------
const s3 = new AWS.S3({
  endpoint: process.env.R2_ENDPOINT, // example: https://pub-xxxxxx.r2.dev
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

// ----------------- HELPER - Upload to R2 -----------------
const uploadToR2 = async (base64Image: string, fileNamePrefix = "bill") => {
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

    // IMPORTANT: R2 public URL format
    return `${process.env.R2_PUBLIC_URL}/${key}`;
  } catch (err) {
    console.error("R2 Upload Error:", err);
    return null;
  }
};

// ----------------- TYPES -----------------
type BillCreateInput = Omit<Bill_Upload, "bill_id" | "bill_image"> & {
  vehicle_other_cost_id?: number | null;
  bill_image_base64?: string;
};

type BillUpdateInput = Partial<BillCreateInput>;

// ----------------- CREATE BILL -----------------
export const createBillService = async (data: BillCreateInput) => {
  const imageUrl = data.bill_image_base64
    ? await uploadToR2(data.bill_image_base64)
    : null;

  const bill = await prisma.bill_Upload.create({
    data: {
      vehicle_id: Number(data.vehicle_id) || undefined,
      driver_id: Number(data.driver_id) || undefined,
      bill_type: data.bill_type,
      bill_date: new Date(data.bill_date).toISOString(),
      bill_status: data.bill_status || BillStatus.pending,
      bill_image: imageUrl,

      vehicle_other_cost: data.vehicle_other_cost_id
        ? { connect: { vehicle_other_cost_id: data.vehicle_other_cost_id } }
        : undefined,
    }
  });

  return bill; // ⬅️ Return only the bill object
};


// ----------------- GET ALL BILLS -----------------
export const getAllBillsService = async () => {
  const bills = await prisma.bill_Upload.findMany({
    include: { vehicle: true, driver: true, vehicle_other_cost: true },
  });

  return bills.map((bill) => ({
    bill_id: bill.bill_id,
    bill_type: bill.bill_type,
    bill_date: bill.bill_date,
    bill_status: bill.bill_status,
    bill_image: bill.bill_image || null,
    vehicle_id: bill.vehicle_id,
    vehicle_name: bill.vehicle?.name || null,
    driver_id: bill.driver_id,
    driver_name: bill.driver?.name || null,
    vehicle_other_cost: bill.vehicle_other_cost || null,
  }));
};

// ----------------- GET BILL BY ID -----------------
export const getBillByIdService = async (id: number) => {
  const bill = await prisma.bill_Upload.findUnique({
    where: { bill_id: id },
    include: {
      vehicle: true,
      driver: true,
      vehicle_other_cost: true,
    },
  });

  if (!bill) return null;

  return {
    bill_id: bill.bill_id,
    bill_type: bill.bill_type,
    bill_date: bill.bill_date,
    bill_status: bill.bill_status,
    bill_image: bill.bill_image || null,
    vehicle_id: bill.vehicle_id,
    vehicle_name: bill.vehicle?.name || null,
    driver_id: bill.driver_id,
    driver_name: bill.driver?.name || null,
    vehicle_other_cost: bill.vehicle_other_cost || null,
  };
};

// ----------------- UPDATE BILL -----------------
export const updateBillService = async (id: number, data: BillUpdateInput) => {
  let imageUrl: string | null = null;

  if (data.bill_image_base64) {
    imageUrl = await uploadToR2(data.bill_image_base64);
  }

  const bill = await prisma.bill_Upload.update({
    where: { bill_id: id },
    data: {
      vehicle_id: data.vehicle_id ?? undefined,
      driver_id: data.driver_id ?? undefined,
      bill_type: data.bill_type ?? undefined,
      bill_date: data.bill_date ?? undefined,
      bill_status: data.bill_status ?? undefined,
      bill_image: imageUrl ?? undefined,

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
    bill_image: bill.bill_image || null,
  };
};

// ----------------- DELETE BILL -----------------
export const deleteBillService = async (id: number) => {
  await prisma.bill_Upload.delete({ where: { bill_id: id } });
  return true;
};
