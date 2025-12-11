import { Prisma, Role, Admin, Driver, Customer } from "@prisma/client";
export interface CreateAdminDTO {
    email: string;
    password: string;
    role: Role;
    driver_id?: number;
    customer_id?: number;
}
export interface UpdateAdminDTO {
    email?: string;
    password?: string;
    role?: Role;
    driver_id?: number | null;
    customer_id?: number | null;
}
export interface PerformedBy {
    user_id?: number | null;
    role?: Role | null;
}
/**
 * 🧩 Create a new Admin or SuperAdmin
 */
export declare const createAdminService: (data: CreateAdminDTO, performedBy: PerformedBy) => Promise<Admin>;
/**
 * 📋 Get all Admins (exclude large images)
 */
export declare const getAllAdminsService: () => Promise<({
    driver: {
        driver_id: number;
        name: string;
        nic: string;
        phone_number: string;
        driver_charges: Prisma.Decimal;
        age: number;
        license_number: string;
        license_expiry_date: Date;
    } | null;
    customer: {
        email: string;
        customer_id: number;
        name: string;
        nic: string;
        phone_number: string;
    } | null;
} & {
    email: string;
    password: string;
    role: import(".prisma/client").$Enums.Role;
    admin_id: number;
    driver_id: number | null;
    customer_id: number | null;
})[]>;
/**
 * 🔍 Get Admin by ID (exclude large images)
 */
export declare const getAdminByIdService: (id: number) => Promise<{
    driver: {
        driver_id: number;
        name: string;
        nic: string;
        phone_number: string;
        driver_charges: Prisma.Decimal;
        age: number;
        license_number: string;
        license_expiry_date: Date;
    } | null;
    customer: {
        email: string;
        customer_id: number;
        name: string;
        nic: string;
        phone_number: string;
    } | null;
} & {
    email: string;
    password: string;
    role: import(".prisma/client").$Enums.Role;
    admin_id: number;
    driver_id: number | null;
    customer_id: number | null;
}>;
/**
 * ✏️ Update Admin
 */
export declare const updateAdminService: (id: number, data: UpdateAdminDTO, performedBy: PerformedBy) => Promise<Admin>;
/**
 * ❌ Delete Admin
 */
export declare const deleteAdminService: (id: number, performedBy: PerformedBy) => Promise<boolean>;
/**
 * 🚀 Get Drivers who don't have Admin accounts (exclude images)
 */
export declare const getDriversWithoutAdminService: () => Promise<(Omit<Driver, "image"> & {
    image: null;
})[]>;
/**
 * 🚀 Get Customers who don't have Admin accounts (exclude NIC photos)
 */
export declare const getCustomersWithoutAdminService: () => Promise<(Omit<Customer, "nic_photo_front" | "nic_photo_back"> & {
    nic_photo_front: null;
    nic_photo_back: null;
})[]>;
/**
 * 🔹 Combined helper to get all users without Admin accounts
 */
export declare const getAllUsersWithoutAdminService: () => Promise<{
    drivers: (Omit<{
        driver_id: number;
        name: string;
        nic: string;
        phone_number: string;
        driver_charges: Prisma.Decimal;
        image: Prisma.Bytes | null;
        age: number;
        license_number: string;
        license_expiry_date: Date;
    }, "image"> & {
        image: null;
    })[];
    customers: (Omit<{
        email: string;
        customer_id: number;
        name: string;
        nic: string;
        nic_photo_front: Prisma.Bytes | null;
        nic_photo_back: Prisma.Bytes | null;
        phone_number: string;
    }, "nic_photo_front" | "nic_photo_back"> & {
        nic_photo_front: null;
        nic_photo_back: null;
    })[];
}>;
//# sourceMappingURL=adminRoleService.d.ts.map