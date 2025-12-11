import { Bill_Upload } from "@prisma/client";
type BillCreateInput = Omit<Bill_Upload, "bill_id" | "bill_image"> & {
    vehicle_other_cost_id?: number | null;
    bill_image_base64?: string;
};
type BillUpdateInput = Partial<BillCreateInput>;
export declare const createBillService: (data: BillCreateInput) => Promise<{
    driver_id: number | null;
    vehicle_id: number | null;
    bill_id: number;
    bill_image: string | null;
    bill_type: import(".prisma/client").$Enums.BillType;
    bill_date: Date;
    bill_status: import(".prisma/client").$Enums.BillStatus;
}>;
export declare const getAllBillsService: () => Promise<{
    bill_id: number;
    bill_type: import(".prisma/client").$Enums.BillType;
    bill_date: Date;
    bill_status: import(".prisma/client").$Enums.BillStatus;
    bill_image: string | null;
    vehicle_id: number | null;
    vehicle_name: string | null;
    driver_id: number | null;
    driver_name: string | null;
    vehicle_other_cost: {
        vehicle_id: number;
        bill_id: number | null;
        cost: import("@prisma/client/runtime/library.js").Decimal;
        vehicle_other_cost_id: number;
        date: Date;
        cost_type: import(".prisma/client").$Enums.VehicleCostType;
    } | null;
}[]>;
export declare const getBillByIdService: (id: number) => Promise<{
    bill_id: number;
    bill_type: import(".prisma/client").$Enums.BillType;
    bill_date: Date;
    bill_status: import(".prisma/client").$Enums.BillStatus;
    bill_image: string | null;
    vehicle_id: number | null;
    vehicle_name: string | null;
    driver_id: number | null;
    driver_name: string | null;
    vehicle_other_cost: {
        vehicle_id: number;
        bill_id: number | null;
        cost: import("@prisma/client/runtime/library.js").Decimal;
        vehicle_other_cost_id: number;
        date: Date;
        cost_type: import(".prisma/client").$Enums.VehicleCostType;
    } | null;
} | null>;
export declare const updateBillService: (id: number, data: BillUpdateInput) => Promise<{
    bill_image: string | null;
    driver: {
        driver_id: number;
        name: string;
        nic: string;
        phone_number: string;
        driver_charges: import("@prisma/client/runtime/library.js").Decimal;
        image: import("@prisma/client/runtime/library.js").Bytes | null;
        age: number;
        license_number: string;
        license_expiry_date: Date;
    } | null;
    vehicle: {
        name: string;
        owner_id: number | null;
        vehicle_id: number;
        image: import("@prisma/client/runtime/library.js").Bytes | null;
        license_expiry_date: Date | null;
        vehicle_number: string;
        type: import(".prisma/client").$Enums.VehicleType;
        rent_cost_daily: import("@prisma/client/runtime/library.js").Decimal;
        ac_type: import(".prisma/client").$Enums.AcType;
        owner_cost_monthly: import("@prisma/client/runtime/library.js").Decimal;
        license_image: import("@prisma/client/runtime/library.js").Bytes | null;
        insurance_card_image: import("@prisma/client/runtime/library.js").Bytes | null;
        eco_test_image: import("@prisma/client/runtime/library.js").Bytes | null;
        book_image: import("@prisma/client/runtime/library.js").Bytes | null;
        insurance_expiry_date: Date | null;
        eco_test_expiry_date: Date | null;
        vehicle_fuel_efficiency: import("@prisma/client/runtime/library.js").Decimal | null;
        vehicle_availability: import(".prisma/client").$Enums.AvailabilityStatus;
        meter_number: number | null;
        last_service_meter_number: number | null;
        fuel_id: number;
    } | null;
    vehicle_other_cost: {
        vehicle_id: number;
        bill_id: number | null;
        cost: import("@prisma/client/runtime/library.js").Decimal;
        vehicle_other_cost_id: number;
        date: Date;
        cost_type: import(".prisma/client").$Enums.VehicleCostType;
    } | null;
    driver_id: number | null;
    vehicle_id: number | null;
    bill_id: number;
    bill_type: import(".prisma/client").$Enums.BillType;
    bill_date: Date;
    bill_status: import(".prisma/client").$Enums.BillStatus;
}>;
export declare const deleteBillService: (id: number) => Promise<boolean>;
export {};
//# sourceMappingURL=billUploadService.d.ts.map