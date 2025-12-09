import { prisma } from "../config/prismaClient";
import { Vehicle_Other_Cost, BillStatus } from "@prisma/client";

type VehicleCostCreateInput = Omit<Vehicle_Other_Cost, "vehicle_other_cost_id"> & {
  bill_id?: number | null; // optional relation to Bill_Upload
};

type VehicleCostUpdateInput = Partial<VehicleCostCreateInput>;

/**
 * ✅ CREATE Vehicle Other Cost
 */
export const createVehicleCostService = async (data: VehicleCostCreateInput) => {
  let billConnection;

  if (data.bill_id) {
    // If bill_id provided, update bill status to completed and connect
    const updatedBill = await prisma.bill_Upload.update({
      where: { bill_id: data.bill_id },
      data: { bill_status: BillStatus.completed },
    });
    billConnection = { connect: { bill_id: updatedBill.bill_id } };
  }

  const vehicleCost = await prisma.vehicle_Other_Cost.create({
    data: {
      vehicle_id: data.vehicle_id,
      date: data.date,
      cost: data.cost,
      cost_type: data.cost_type,
      bill: billConnection, // only connect if bill_id exists
    },
    include: {
    },
  });

  return vehicleCost;
};

/**
 * ✅ READ ALL Vehicle Other Costs
 */
export const getAllVehicleCostsService = async () => {
  return await prisma.vehicle_Other_Cost.findMany({
    include: {
      vehicle: true,
      bill: true,
    },
  });
};

/**
 * ✅ READ Vehicle Other Cost BY ID
 */
export const getVehicleCostByIdService = async (id: number) => {
  return await prisma.vehicle_Other_Cost.findUnique({
    where: { vehicle_other_cost_id: id },
    include: {
      vehicle: true,
      bill: true,
    },
  });
};

/**
 * ✅ UPDATE Vehicle Other Cost
 */
export const updateVehicleCostService = async (id: number, data: VehicleCostUpdateInput) => {
  let billConnection;

  if (data.bill_id) {
    // If bill_id is provided, update its status to completed and connect
    const updatedBill = await prisma.bill_Upload.update({
      where: { bill_id: data.bill_id },
      data: { bill_status: BillStatus.completed },
    });
    billConnection = { connect: { bill_id: updatedBill.bill_id } };
  } else if (data.bill_id === null) {
    // If bill_id explicitly null, disconnect the relation
    billConnection = { disconnect: true };
  }

  const updatedVehicleCost = await prisma.vehicle_Other_Cost.update({
    where: { vehicle_other_cost_id: id },
    data: {
      vehicle_id: data.vehicle_id,
      date: data.date,
      cost: data.cost,
      cost_type: data.cost_type,
      bill: billConnection, // only connect/disconnect if provided
    },
    include: {
      vehicle: true,
      bill: true,
    },
  });

  return updatedVehicleCost;
};

/**
 * ✅ DELETE Vehicle Other Cost
 */
export const deleteVehicleCostService = async (id: number) => {
  await prisma.vehicle_Other_Cost.delete({
    where: { vehicle_other_cost_id: id },
  });
  return true;
};
