import { Owner } from "@prisma/client";
export declare const createOwnerService: (data: Pick<Owner, "owner_name" | "contact_number">) => Promise<{
    owner_id: number;
    owner_name: string;
    contact_number: string;
}>;
export declare const getAllOwnersService: () => Promise<({
    vehicles: {
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
    }[];
} & {
    owner_id: number;
    owner_name: string;
    contact_number: string;
})[]>;
export declare const getOwnerByIdService: (id: number) => Promise<({
    vehicles: {
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
    }[];
} & {
    owner_id: number;
    owner_name: string;
    contact_number: string;
}) | null>;
export declare const updateOwnerService: (id: number, data: Partial<Pick<Owner, "owner_name" | "contact_number">>) => Promise<{
    owner_id: number;
    owner_name: string;
    contact_number: string;
}>;
export declare const deleteOwnerService: (id: number) => Promise<boolean>;
//# sourceMappingURL=ownerService.d.ts.map