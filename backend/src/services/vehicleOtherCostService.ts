import { prisma } from "../config/prismaClient.js";
import {
  BillStatus,
  VehicleCostType,
  Prisma,
} from "@prisma/client";

/* ============================
   DTOs (Updated with remarks + liters)
============================ */

export type VehicleCostCreateInput = {
  vehicle_id: number;
  date: Date;
  cost: number;
  cost_type: VehicleCostType;
  bill_id?: number | null;
  remarks?: string | null;
  liters?: number | null; // only for fuel, otherwise null

  // Extra fields for vehicle update
  service_meter_number?: number;
  insurance_expiry_date?: Date;
  license_expiry_date?: Date;
  eco_test_expiry_date?: Date;
};

export type VehicleCostUpdateInput = Partial<VehicleCostCreateInput>;

/* ============================
   CREATE Vehicle Other Cost
============================ */

export const createVehicleCostService = async (
  data: VehicleCostCreateInput
) => {
  return await prisma.$transaction(async (tx) => {
    let bill_id: number | undefined;

    // 1. Update Bill status if bill_id provided
    if (data.bill_id) {
      const updatedBill = await tx.bill_Upload.update({
        where: { bill_id: data.bill_id },
        data: { bill_status: BillStatus.completed },
      });
      bill_id = updatedBill.bill_id;
    }

    // 2. Create Vehicle Other Cost
    const vehicleCost = await tx.vehicle_Other_Cost.create({
      data: {
        vehicle_id: data.vehicle_id,
        date: data.date,
        cost: data.cost,
        cost_type: data.cost_type,
        bill_id,
        remarks: data.remarks ?? null,
        liters: data.liters ?? null, // keep null if frontend does not send
      },
      include: {
        vehicle: true,
        bill: true,
      },
    });

    // 3. Prepare vehicle updates
    const vehicleUpdateData: Prisma.VehicleUpdateInput = {};

    switch (data.cost_type) {
      case "Service_Cost":
        if (data.service_meter_number !== undefined) {
          vehicleUpdateData.last_service_meter_number =
            data.service_meter_number;
        }
        break;

      case "Insurance_Amount":
        if (data.insurance_expiry_date) {
          vehicleUpdateData.insurance_expiry_date =
            data.insurance_expiry_date;
        }
        break;

      case "Revenue_License":
        if (data.license_expiry_date) {
          vehicleUpdateData.license_expiry_date =
            data.license_expiry_date;
        }
        break;

      case "Eco_Test_Cost":
        if (data.eco_test_expiry_date) {
          vehicleUpdateData.eco_test_expiry_date =
            data.eco_test_expiry_date;
        }
        break;
    }

    // 4. Update vehicle if needed
    if (Object.keys(vehicleUpdateData).length > 0) {
      await tx.vehicle.update({
        where: { vehicle_id: data.vehicle_id },
        data: vehicleUpdateData,
      });
    }

    return vehicleCost;
  });
};

/* ============================
   READ ALL Vehicle Other Costs
============================ */

export const getAllVehicleCostsService = async () => {
  return await prisma.vehicle_Other_Cost.findMany({
    include: {
      vehicle: true,
      bill: true,
    },
    orderBy: {
      vehicle_other_cost_id: "desc",
    },
  });
};

/* ============================
   READ Vehicle Other Cost BY ID
============================ */

export const getVehicleCostByIdService = async (id: number) => {
  return await prisma.vehicle_Other_Cost.findUnique({
    where: { vehicle_other_cost_id: id },
    include: {
      vehicle: true,
      bill: true,
    },
  });
};

/* ============================
   UPDATE Vehicle Other Cost
============================ */

export const updateVehicleCostService = async (
  id: number,
  data: VehicleCostUpdateInput
) => {
  return await prisma.$transaction(async (tx) => {
    let billConnection: Prisma.Bill_UploadUpdateOneWithoutVehicle_other_costNestedInput | undefined;

    if (data.bill_id !== undefined && data.bill_id !== null) {
      const updatedBill = await tx.bill_Upload.update({
        where: { bill_id: data.bill_id },
        data: { bill_status: BillStatus.completed },
      });

      billConnection = { connect: { bill_id: updatedBill.bill_id } };
    } else if (data.bill_id === null) {
      billConnection = { disconnect: true };
    }

    const updateData: Prisma.Vehicle_Other_CostUpdateInput = {
      remarks: data.remarks ?? undefined,
    };

    if (data.vehicle_id !== undefined) {
      updateData.vehicle = {
        connect: { vehicle_id: data.vehicle_id },
      };
    }

    if (data.date !== undefined) {
      updateData.date = data.date;
    }

    if (data.cost !== undefined) {
      updateData.cost = data.cost;
    }

    if (data.cost_type !== undefined) {
      updateData.cost_type = data.cost_type;
    }

    if (data.liters !== undefined) {
      updateData.liters = data.liters; // if null sent, saves null
    }

    if (billConnection !== undefined) {
      updateData.bill = billConnection;
    }

    const updatedCost = await tx.vehicle_Other_Cost.update({
      where: { vehicle_other_cost_id: id },
      data: updateData,
      include: {
        vehicle: true,
        bill: true,
      },
    });

    // Optional vehicle updates only if vehicle_id exists in payload
    if (data.vehicle_id !== undefined) {
      const vehicleUpdateData: Prisma.VehicleUpdateInput = {};

      switch (data.cost_type) {
        case "Service_Cost":
          if (data.service_meter_number !== undefined) {
            vehicleUpdateData.last_service_meter_number =
              data.service_meter_number;
          }
          break;

        case "Insurance_Amount":
          if (data.insurance_expiry_date) {
            vehicleUpdateData.insurance_expiry_date =
              data.insurance_expiry_date;
          }
          break;

        case "Revenue_License":
          if (data.license_expiry_date) {
            vehicleUpdateData.license_expiry_date =
              data.license_expiry_date;
          }
          break;

        case "Eco_Test_Cost":
          if (data.eco_test_expiry_date) {
            vehicleUpdateData.eco_test_expiry_date =
              data.eco_test_expiry_date;
          }
          break;
      }

      if (Object.keys(vehicleUpdateData).length > 0) {
        await tx.vehicle.update({
          where: { vehicle_id: data.vehicle_id },
          data: vehicleUpdateData,
        });
      }
    }

    return updatedCost;
  });
};

/* ============================
   DELETE Vehicle Other Cost
============================ */

export const deleteVehicleCostService = async (id: number) => {
  await prisma.vehicle_Other_Cost.delete({
    where: { vehicle_other_cost_id: id },
  });
  return true;
};