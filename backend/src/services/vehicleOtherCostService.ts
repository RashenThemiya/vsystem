import { prisma } from "../config/prismaClient";
import { Vehicle_Other_Cost } from "@prisma/client";

type VehicleCostCreateInput = Omit<Vehicle_Other_Cost, "vehicle_other_cost_id">;
type VehicleCostUpdateInput = Partial<VehicleCostCreateInput>;

// CREATE
export const createVehicleCostService = async (data: VehicleCostCreateInput) => {
  return await prisma.vehicle_Other_Cost.create({
    data: {
      vehicle_id: data.vehicle_id,
      date: data.date,
      cost: data.cost,
      cost_type: data.cost_type,
    },
  });
};

// READ ALL
export const getAllVehicleCostsService = async () => {
  return await prisma.vehicle_Other_Cost.findMany({ include: { vehicle: true } });
};

// READ BY ID
export const getVehicleCostByIdService = async (id: number) => {
  return await prisma.vehicle_Other_Cost.findUnique({
    where: { vehicle_other_cost_id: id },
    include: { vehicle: true },
  });
};

// UPDATE
export const updateVehicleCostService = async (id: number, data: VehicleCostUpdateInput) => {
  return await prisma.vehicle_Other_Cost.update({
    where: { vehicle_other_cost_id: id },
    data: {
      vehicle_id: data.vehicle_id,
      date: data.date,
      cost: data.cost,
      cost_type: data.cost_type,
    },
  });
};

// DELETE
export const deleteVehicleCostService = async (id: number) => {
  await prisma.vehicle_Other_Cost.delete({ where: { vehicle_other_cost_id: id } });
  return true;
};
