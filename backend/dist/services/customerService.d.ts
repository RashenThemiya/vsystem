interface CustomerInput {
    name: string;
    nic: string;
    phone_number: string;
    email: string;
    nic_photo_front?: string;
    nic_photo_back?: string;
}
export declare const createCustomerService: (data: CustomerInput) => Promise<{
    nic_photo_front: string | null;
    nic_photo_back: string | null;
    email: string;
    customer_id: number;
    name: string;
    nic: string;
    phone_number: string;
}>;
/**
 * ✅ Get all customers (convert Bytes → Base64)
 */
export declare const getAllCustomersService: () => Promise<{
    nic_photo_front: string | null;
    nic_photo_back: string | null;
    email: string;
    customer_id: number;
    name: string;
    nic: string;
    phone_number: string;
}[]>;
/**
 * ✅ Get single customer by ID
 */
export declare const getCustomerByIdService: (id: number) => Promise<{
    nic_photo_front: string | null;
    nic_photo_back: string | null;
    trips: ({
        map: {
            sequence: number;
            trip_id: number;
            map_id: number;
            latitude: import("@prisma/client/runtime/library.js").Decimal;
            longitude: import("@prisma/client/runtime/library.js").Decimal;
            location_name: string;
        }[];
        payments: {
            payment_date: Date;
            trip_id: number;
            amount: import("@prisma/client/runtime/library.js").Decimal;
            payment_id: number;
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
        profit: import("@prisma/client/runtime/library.js").Decimal | null;
        fuel_cost: import("@prisma/client/runtime/library.js").Decimal | null;
        driver_cost: import("@prisma/client/runtime/library.js").Decimal | null;
        vehicle_rent_daily: import("@prisma/client/runtime/library.js").Decimal | null;
        fuel_efficiency: import("@prisma/client/runtime/library.js").Decimal | null;
        created_at: Date;
    })[];
    email: string;
    customer_id: number;
    name: string;
    nic: string;
    phone_number: string;
}>;
/**
 * ✅ Update customer by ID
 */
export declare const updateCustomerService: (id: number, data: Partial<CustomerInput>) => Promise<{
    nic_photo_front: string | null;
    nic_photo_back: string | null;
    email: string;
    customer_id: number;
    name: string;
    nic: string;
    phone_number: string;
}>;
/**
 * ✅ Delete customer by ID
 */
export declare const deleteCustomerService: (id: number) => Promise<boolean>;
export declare const getCustomerKpiService: (customerId: number) => Promise<{
    pieChart: {
        Paid: number;
        Partially_Paid: number;
        Unpaid: number;
    };
    barChart: {
        Pending: number;
        Ongoing: number;
        Ended: number;
        Completed: number;
        Cancelled: number;
    };
}>;
export {};
//# sourceMappingURL=customerService.d.ts.map