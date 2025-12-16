import { TripStatus } from "@prisma/client";
interface DriverInput {
    name: string;
    phone_number: string;
    driver_charges: number;
    nic: string;
    image?: string;
    age: number;
    license_number: string;
    license_expiry_date: string;
}
export declare const createDriverService: (data: DriverInput) => Promise<{
    image: string | null;
    driver_id: number;
    name: string;
    nic: string;
    phone_number: string;
    driver_charges: import("@prisma/client/runtime/library.js").Decimal;
    age: number;
    license_number: string;
    license_expiry_date: Date;
}>;
/**
 * ✅ Get all drivers (with base64 images)
 */
export declare const getAllDriversService: () => Promise<{
    image: string | null;
    driver_id: number;
    name: string;
    nic: string;
    phone_number: string;
    driver_charges: import("@prisma/client/runtime/library.js").Decimal;
    age: number;
    license_number: string;
    license_expiry_date: Date;
}[]>;
/**
 * ✅ Get driver by ID
 */
export declare const getDriverByIdService: (id: number) => Promise<{
    image: string | null;
    trips: {
        driver_id: number | null;
        customer_id: number;
        trip_id: number;
        map_id: number | null;
        vehicle_id: number;
        from_location: string;
        to_location: string;
        up_down: import(".prisma/client").$Enums.TripDirection;
        estimated_distance: import("@prisma/client/runtime/library.js").Decimal | null;
        actual_distance: import("@prisma/client/runtime/library.js").Decimal | null;
        estimated_days: number | null;
        actual_days: number | null;
        leaving_datetime: Date;
        estimated_return_datetime: Date | null;
        actual_return_datetime: Date | null;
        driver_required: import(".prisma/client").$Enums.YesNo;
        estimated_cost: import("@prisma/client/runtime/library.js").Decimal | null;
        actual_cost: import("@prisma/client/runtime/library.js").Decimal | null;
        mileage_cost: import("@prisma/client/runtime/library.js").Decimal | null;
        fuel_required: import(".prisma/client").$Enums.YesNo;
        num_passengers: number | null;
        discount: import("@prisma/client/runtime/library.js").Decimal | null;
        damage_cost: import("@prisma/client/runtime/library.js").Decimal | null;
        payment_amount: import("@prisma/client/runtime/library.js").Decimal | null;
        advance_payment: import("@prisma/client/runtime/library.js").Decimal | null;
        start_meter: number | null;
        end_meter: number | null;
        total_estimated_cost: import("@prisma/client/runtime/library.js").Decimal | null;
        total_actual_cost: import("@prisma/client/runtime/library.js").Decimal | null;
        payment_status: import(".prisma/client").$Enums.PaymentStatus;
        trip_status: import(".prisma/client").$Enums.TripStatus;
        additional_mileage_cost: import("@prisma/client/runtime/library.js").Decimal | null;
        fuel_cost: import("@prisma/client/runtime/library.js").Decimal | null;
        driver_cost: import("@prisma/client/runtime/library.js").Decimal | null;
        vehicle_rent_daily: import("@prisma/client/runtime/library.js").Decimal | null;
        fuel_efficiency: import("@prisma/client/runtime/library.js").Decimal | null;
        created_at: Date;
    }[];
    bill_uploads: {
        driver_id: number | null;
        vehicle_id: number | null;
        bill_id: number;
        bill_image: string | null;
        bill_type: import(".prisma/client").$Enums.BillType;
        bill_date: Date;
        bill_status: import(".prisma/client").$Enums.BillStatus;
    }[];
    driver_id: number;
    name: string;
    nic: string;
    phone_number: string;
    driver_charges: import("@prisma/client/runtime/library.js").Decimal;
    age: number;
    license_number: string;
    license_expiry_date: Date;
}>;
/**
 * ✅ Update driver
 */
export declare const updateDriverService: (id: number, data: Partial<DriverInput>) => Promise<{
    image: string | null;
    driver_id: number;
    name: string;
    nic: string;
    phone_number: string;
    driver_charges: import("@prisma/client/runtime/library.js").Decimal;
    age: number;
    license_number: string;
    license_expiry_date: Date;
}>;
/**
 * ✅ Delete driver
 */
export declare const deleteDriverService: (id: number) => Promise<boolean>;
export declare const getDriverTripsByStatusService: (driverId: number, status: TripStatus) => Promise<{
    customer: {
        email: string;
        customer_id: number;
        name: string;
        phone_number: string;
    };
    trip_id: number;
    from_location: string;
    to_location: string;
    leaving_datetime: Date;
    estimated_return_datetime: Date | null;
    actual_return_datetime: Date | null;
    total_estimated_cost: import("@prisma/client/runtime/library.js").Decimal | null;
    total_actual_cost: import("@prisma/client/runtime/library.js").Decimal | null;
    payment_status: import(".prisma/client").$Enums.PaymentStatus;
    trip_status: import(".prisma/client").$Enums.TripStatus;
    created_at: Date;
    vehicle: {
        name: string;
        vehicle_id: number;
        vehicle_number: string;
        type: import(".prisma/client").$Enums.VehicleType;
    };
}[]>;
export declare const getDriverDetailsOnlyService: (id: number) => Promise<{
    driver_id: number;
    name: string;
    nic: string;
    phone_number: string;
    driver_charges: import("@prisma/client/runtime/library.js").Decimal;
    age: number;
    license_number: string;
    license_expiry_date: Date;
}>;
export {};
//# sourceMappingURL=driverService.d.ts.map