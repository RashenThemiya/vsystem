type AnyObj = Record<string, any>;
/**
 * Create a new vehicle
 */
export declare const createVehicleService: (data: any) => Promise<{
    owner: {
        owner_id: number;
        owner_name: string;
        contact_number: string;
    } | null;
    mileage_costs: {
        vehicle_id: number;
        mileage_cost: import("@prisma/client/runtime/library.js").Decimal;
        mileage_cost_additional: import("@prisma/client/runtime/library.js").Decimal;
        mileage_cost_id: number;
    }[];
    fuel: {
        type: import(".prisma/client").$Enums.FuelType;
        fuel_id: number;
        cost: import("@prisma/client/runtime/library.js").Decimal;
    };
} & {
    name: string;
    owner_id: number | null;
    vehicle_id: number;
    image: import("@prisma/client/runtime/library.js").Bytes | null;
    license_expiry_date: Date | null;
    vehicle_number: string;
    type: import(".prisma/client").$Enums.VehicleType;
    rent_cost_daily: import("@prisma/client/runtime/library.js").Decimal;
    fuel_id: number;
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
}>;
/**
 * Get all vehicles (no image data)
 */
/**
 * ✅ Get all vehicles with essential details and related data
 */ export declare const getAllVehiclesService: () => Promise<{
    name: string;
    owner: {
        owner_id: number;
        owner_name: string;
        contact_number: string;
    } | null;
    _count: {
        trips: number;
        bill_uploads: number;
    };
    vehicle_id: number;
    license_expiry_date: Date | null;
    vehicle_number: string;
    type: import(".prisma/client").$Enums.VehicleType;
    rent_cost_daily: import("@prisma/client/runtime/library.js").Decimal;
    ac_type: import(".prisma/client").$Enums.AcType;
    owner_cost_monthly: import("@prisma/client/runtime/library.js").Decimal;
    insurance_expiry_date: Date | null;
    eco_test_expiry_date: Date | null;
    vehicle_fuel_efficiency: import("@prisma/client/runtime/library.js").Decimal | null;
    vehicle_availability: import(".prisma/client").$Enums.AvailabilityStatus;
    meter_number: number | null;
    last_service_meter_number: number | null;
    mileage_costs: {
        vehicle_id: number;
        mileage_cost: import("@prisma/client/runtime/library.js").Decimal;
        mileage_cost_additional: import("@prisma/client/runtime/library.js").Decimal;
        mileage_cost_id: number;
    }[];
    fuel: {
        type: import(".prisma/client").$Enums.FuelType;
        fuel_id: number;
        cost: import("@prisma/client/runtime/library.js").Decimal;
    };
}[]>;
/**
 * ✅ Get a single vehicle by ID with all related tables
 */
export declare const getVehicleByIdService: (id: number) => Promise<({
    owner: {
        owner_id: number;
        owner_name: string;
        contact_number: string;
    } | null;
    trips: ({} & {
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
    })[];
    bill_uploads: {
        driver_id: number | null;
        vehicle_id: number | null;
        bill_id: number;
        bill_image: string | null;
        bill_type: import(".prisma/client").$Enums.BillType;
        bill_date: Date;
        bill_status: import(".prisma/client").$Enums.BillStatus;
    }[];
    mileage_costs: {
        vehicle_id: number;
        mileage_cost: import("@prisma/client/runtime/library.js").Decimal;
        mileage_cost_additional: import("@prisma/client/runtime/library.js").Decimal;
        mileage_cost_id: number;
    }[];
    gps: {
        vehicle_id: number;
        tracker_id: string;
        recorded_at: Date;
        latitude: import("@prisma/client/runtime/library.js").Decimal;
        longitude: import("@prisma/client/runtime/library.js").Decimal;
        gps_id: number;
    }[];
    fuel: {
        type: import(".prisma/client").$Enums.FuelType;
        fuel_id: number;
        cost: import("@prisma/client/runtime/library.js").Decimal;
    };
    vehicle_other_costs: {
        vehicle_id: number;
        bill_id: number | null;
        cost: import("@prisma/client/runtime/library.js").Decimal;
        vehicle_other_cost_id: number;
        date: Date;
        cost_type: import(".prisma/client").$Enums.VehicleCostType;
    }[];
} & {
    name: string;
    owner_id: number | null;
    vehicle_id: number;
    image: import("@prisma/client/runtime/library.js").Bytes | null;
    license_expiry_date: Date | null;
    vehicle_number: string;
    type: import(".prisma/client").$Enums.VehicleType;
    rent_cost_daily: import("@prisma/client/runtime/library.js").Decimal;
    fuel_id: number;
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
}) | null>;
/**
 * Update vehicle
 */
/**
 * Update a vehicle and related data (GPS, Mileage, Owner)

*/
export declare const updateVehicleService: (id: number, data: AnyObj) => Promise<({
    owner: {
        owner_id: number;
        owner_name: string;
        contact_number: string;
    } | null;
    trips: ({
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
        customer: {
            email: string;
            customer_id: number;
            name: string;
            nic: string;
            nic_photo_front: import("@prisma/client/runtime/library.js").Bytes | null;
            nic_photo_back: import("@prisma/client/runtime/library.js").Bytes | null;
            phone_number: string;
        };
        map: {
            sequence: number;
            trip_id: number;
            map_id: number;
            latitude: import("@prisma/client/runtime/library.js").Decimal;
            longitude: import("@prisma/client/runtime/library.js").Decimal;
            location_name: string;
        }[];
        payments: {
            trip_id: number;
            amount: import("@prisma/client/runtime/library.js").Decimal;
            payment_date: Date;
            payment_id: number;
        }[];
        other_trip_costs: {
            trip_id: number;
            cost_type: import(".prisma/client").$Enums.TripCostType;
            cost_amount: import("@prisma/client/runtime/library.js").Decimal;
            trip_other_cost_id: number;
        }[];
    } & {
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
    })[];
    bill_uploads: {
        driver_id: number | null;
        vehicle_id: number | null;
        bill_id: number;
        bill_image: string | null;
        bill_type: import(".prisma/client").$Enums.BillType;
        bill_date: Date;
        bill_status: import(".prisma/client").$Enums.BillStatus;
    }[];
    mileage_costs: {
        vehicle_id: number;
        mileage_cost: import("@prisma/client/runtime/library.js").Decimal;
        mileage_cost_additional: import("@prisma/client/runtime/library.js").Decimal;
        mileage_cost_id: number;
    }[];
    gps: {
        vehicle_id: number;
        tracker_id: string;
        recorded_at: Date;
        latitude: import("@prisma/client/runtime/library.js").Decimal;
        longitude: import("@prisma/client/runtime/library.js").Decimal;
        gps_id: number;
    }[];
    fuel: {
        type: import(".prisma/client").$Enums.FuelType;
        fuel_id: number;
        cost: import("@prisma/client/runtime/library.js").Decimal;
    };
    vehicle_other_costs: {
        vehicle_id: number;
        bill_id: number | null;
        cost: import("@prisma/client/runtime/library.js").Decimal;
        vehicle_other_cost_id: number;
        date: Date;
        cost_type: import(".prisma/client").$Enums.VehicleCostType;
    }[];
} & {
    name: string;
    owner_id: number | null;
    vehicle_id: number;
    image: import("@prisma/client/runtime/library.js").Bytes | null;
    license_expiry_date: Date | null;
    vehicle_number: string;
    type: import(".prisma/client").$Enums.VehicleType;
    rent_cost_daily: import("@prisma/client/runtime/library.js").Decimal;
    fuel_id: number;
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
}) | null>;
/**
 * Delete vehicle and all related data (GPS, mileage, etc.)
 */
export declare const deleteVehicleService: (id: number) => Promise<{
    message: string;
}>;
export {};
//# sourceMappingURL=vehicleService.d.ts.map