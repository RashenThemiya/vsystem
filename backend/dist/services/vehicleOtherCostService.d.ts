import { Vehicle_Other_Cost, Prisma } from "@prisma/client";
type VehicleCostCreateInput = Omit<Vehicle_Other_Cost, "vehicle_other_cost_id"> & {
    bill_id?: number | null;
};
type VehicleCostUpdateInput = Partial<VehicleCostCreateInput>;
/**
 * ✅ CREATE Vehicle Other Cost
 */
export declare const createVehicleCostService: (data: VehicleCostCreateInput) => Promise<{
    bill: {
        driver_id: number | null;
        vehicle_id: number | null;
        bill_id: number;
        bill_image: string | null;
        bill_type: import(".prisma/client").$Enums.BillType;
        bill_date: Date;
        bill_status: import(".prisma/client").$Enums.BillStatus;
    } | null;
} & {
    vehicle_id: number;
    bill_id: number | null;
    cost: Prisma.Decimal;
    vehicle_other_cost_id: number;
    date: Date;
    cost_type: import(".prisma/client").$Enums.VehicleCostType;
}>;
/**
 * ✅ READ ALL Vehicle Other Costs
 */
export declare const getAllVehicleCostsService: () => Promise<({
    vehicle: {
        name: string;
        owner_id: number | null;
        vehicle_id: number;
        image: Prisma.Bytes | null;
        license_expiry_date: Date | null;
        vehicle_number: string;
        type: import(".prisma/client").$Enums.VehicleType;
        rent_cost_daily: Prisma.Decimal;
        ac_type: import(".prisma/client").$Enums.AcType;
        owner_cost_monthly: Prisma.Decimal;
        license_image: Prisma.Bytes | null;
        insurance_card_image: Prisma.Bytes | null;
        eco_test_image: Prisma.Bytes | null;
        book_image: Prisma.Bytes | null;
        insurance_expiry_date: Date | null;
        eco_test_expiry_date: Date | null;
        vehicle_fuel_efficiency: Prisma.Decimal | null;
        vehicle_availability: import(".prisma/client").$Enums.AvailabilityStatus;
        meter_number: number | null;
        last_service_meter_number: number | null;
        fuel_id: number;
    };
    bill: {
        driver_id: number | null;
        vehicle_id: number | null;
        bill_id: number;
        bill_image: string | null;
        bill_type: import(".prisma/client").$Enums.BillType;
        bill_date: Date;
        bill_status: import(".prisma/client").$Enums.BillStatus;
    } | null;
} & {
    vehicle_id: number;
    bill_id: number | null;
    cost: Prisma.Decimal;
    vehicle_other_cost_id: number;
    date: Date;
    cost_type: import(".prisma/client").$Enums.VehicleCostType;
})[]>;
/**
 * ✅ READ Vehicle Other Cost BY ID
 */
export declare const getVehicleCostByIdService: (id: number) => Promise<({
    vehicle: {
        name: string;
        owner_id: number | null;
        vehicle_id: number;
        image: Prisma.Bytes | null;
        license_expiry_date: Date | null;
        vehicle_number: string;
        type: import(".prisma/client").$Enums.VehicleType;
        rent_cost_daily: Prisma.Decimal;
        ac_type: import(".prisma/client").$Enums.AcType;
        owner_cost_monthly: Prisma.Decimal;
        license_image: Prisma.Bytes | null;
        insurance_card_image: Prisma.Bytes | null;
        eco_test_image: Prisma.Bytes | null;
        book_image: Prisma.Bytes | null;
        insurance_expiry_date: Date | null;
        eco_test_expiry_date: Date | null;
        vehicle_fuel_efficiency: Prisma.Decimal | null;
        vehicle_availability: import(".prisma/client").$Enums.AvailabilityStatus;
        meter_number: number | null;
        last_service_meter_number: number | null;
        fuel_id: number;
    };
    bill: {
        driver_id: number | null;
        vehicle_id: number | null;
        bill_id: number;
        bill_image: string | null;
        bill_type: import(".prisma/client").$Enums.BillType;
        bill_date: Date;
        bill_status: import(".prisma/client").$Enums.BillStatus;
    } | null;
} & {
    vehicle_id: number;
    bill_id: number | null;
    cost: Prisma.Decimal;
    vehicle_other_cost_id: number;
    date: Date;
    cost_type: import(".prisma/client").$Enums.VehicleCostType;
}) | null>;
/**
 * ✅ UPDATE Vehicle Other Cost
 */
export declare const updateVehicleCostService: (id: number, data: VehicleCostUpdateInput) => Promise<{
    vehicle: {
        name: string;
        owner_id: number | null;
        vehicle_id: number;
        image: Prisma.Bytes | null;
        license_expiry_date: Date | null;
        vehicle_number: string;
        type: import(".prisma/client").$Enums.VehicleType;
        rent_cost_daily: Prisma.Decimal;
        ac_type: import(".prisma/client").$Enums.AcType;
        owner_cost_monthly: Prisma.Decimal;
        license_image: Prisma.Bytes | null;
        insurance_card_image: Prisma.Bytes | null;
        eco_test_image: Prisma.Bytes | null;
        book_image: Prisma.Bytes | null;
        insurance_expiry_date: Date | null;
        eco_test_expiry_date: Date | null;
        vehicle_fuel_efficiency: Prisma.Decimal | null;
        vehicle_availability: import(".prisma/client").$Enums.AvailabilityStatus;
        meter_number: number | null;
        last_service_meter_number: number | null;
        fuel_id: number;
    };
    bill: {
        driver_id: number | null;
        vehicle_id: number | null;
        bill_id: number;
        bill_image: string | null;
        bill_type: import(".prisma/client").$Enums.BillType;
        bill_date: Date;
        bill_status: import(".prisma/client").$Enums.BillStatus;
    } | null;
} & {
    vehicle_id: number;
    bill_id: number | null;
    cost: Prisma.Decimal;
    vehicle_other_cost_id: number;
    date: Date;
    cost_type: import(".prisma/client").$Enums.VehicleCostType;
}>;
/**
 * ✅ DELETE Vehicle Other Cost
 */
export declare const deleteVehicleCostService: (id: number) => Promise<boolean>;
export {};
//# sourceMappingURL=vehicleOtherCostService.d.ts.map