import bcrypt from "bcryptjs";
import { prisma } from "../config/prismaClient.js";
// Helper for safely casting JSON for Prisma
const asJson = (value) => value;
/**
 * 🧩 Create a new Admin or SuperAdmin
 */
export const createAdminService = async (data, performedBy) => {
    const { email, password, role, driver_id, customer_id } = data;
    if (!email || !password || !role)
        throw new Error("Missing required fields");
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing)
        throw new Error("Admin with this email already exists");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.admin.create({
        data: {
            email,
            password: hashedPassword,
            role,
            driver: driver_id ? { connect: { driver_id } } : undefined,
            customer: customer_id ? { connect: { customer_id } } : undefined,
        },
    });
    await prisma.auditLog.create({
        data: {
            user_id: performedBy?.user_id ?? null,
            user_role: performedBy?.role ?? null,
            action_type: "CREATE",
            entity_name: "Admin",
            entity_id: newAdmin.admin_id,
            new_data: asJson(newAdmin),
            description: `${role} account created for ${email}`,
        },
    });
    return newAdmin;
};
/**
 * 📋 Get all Admins (exclude large images)
 */
export const getAllAdminsService = async () => prisma.admin.findMany({
    include: {
        driver: {
            select: {
                driver_id: true,
                name: true,
                phone_number: true,
                driver_charges: true,
                nic: true,
                age: true,
                license_number: true,
                license_expiry_date: true,
            },
        },
        customer: {
            select: {
                customer_id: true,
                name: true,
                phone_number: true,
                email: true,
                nic: true,
            },
        },
    },
    orderBy: { admin_id: "asc" },
});
/**
 * 🔍 Get Admin by ID (exclude large images)
 */
export const getAdminByIdService = async (id) => {
    const admin = await prisma.admin.findUnique({
        where: { admin_id: id },
        include: {
            driver: {
                select: {
                    driver_id: true,
                    name: true,
                    phone_number: true,
                    driver_charges: true,
                    nic: true,
                    age: true,
                    license_number: true,
                    license_expiry_date: true,
                },
            },
            customer: {
                select: {
                    customer_id: true,
                    name: true,
                    phone_number: true,
                    email: true,
                    nic: true,
                },
            },
        },
    });
    if (!admin)
        throw new Error("Admin not found");
    return admin;
};
/**
 * ✏️ Update Admin
 */
export const updateAdminService = async (id, data, performedBy) => {
    const existing = await prisma.admin.findUnique({ where: { admin_id: id } });
    if (!existing)
        throw new Error("Admin not found");
    const updateData = {};
    if (data.role)
        updateData.role = data.role;
    if (data.email)
        updateData.email = data.email;
    if (data.driver_id !== undefined) {
        updateData.driver = data.driver_id
            ? { connect: { driver_id: data.driver_id } }
            : { disconnect: true };
    }
    if (data.customer_id !== undefined) {
        updateData.customer = data.customer_id
            ? { connect: { customer_id: data.customer_id } }
            : { disconnect: true };
    }
    if (data.password) {
        const hashed = await bcrypt.hash(data.password, 10);
        updateData.password = hashed;
        await prisma.auditLog.create({
            data: {
                user_id: performedBy?.user_id ?? null,
                user_role: performedBy?.role ?? null,
                action_type: "UPDATE",
                entity_name: "Admin",
                entity_id: id,
                old_data: asJson(existing),
                new_data: asJson({ ...existing, password: "[updated]" }),
                description: `Password changed for Admin ID: ${id}`,
            },
        });
    }
    const updated = await prisma.admin.update({
        where: { admin_id: id },
        data: updateData,
    });
    await prisma.auditLog.create({
        data: {
            user_id: performedBy?.user_id ?? null,
            user_role: performedBy?.role ?? null,
            action_type: "UPDATE",
            entity_name: "Admin",
            entity_id: id,
            old_data: asJson(existing),
            new_data: asJson(updated),
            description: `Admin updated (${existing.email})`,
        },
    });
    return updated;
};
/**
 * ❌ Delete Admin
 */
export const deleteAdminService = async (id, performedBy) => {
    const existing = await prisma.admin.findUnique({ where: { admin_id: id } });
    if (!existing)
        throw new Error("Admin not found");
    await prisma.admin.delete({ where: { admin_id: id } });
    await prisma.auditLog.create({
        data: {
            user_id: performedBy?.user_id ?? null,
            user_role: performedBy?.role ?? null,
            action_type: "DELETE",
            entity_name: "Admin",
            entity_id: id,
            old_data: asJson(existing),
            description: `Admin deleted (${existing.email})`,
        },
    });
    return true;
};
/**
 * 🚀 Get Drivers who don't have Admin accounts (exclude images)
 */
export const getDriversWithoutAdminService = async () => {
    const drivers = await prisma.driver.findMany({
        where: { admin: { none: {} } },
        select: {
            driver_id: true,
            name: true,
            phone_number: true,
            driver_charges: true,
            nic: true,
            age: true,
            license_number: true,
            license_expiry_date: true,
        },
    });
    return drivers.map(d => ({
        ...d,
        image: null,
    }));
};
/**
 * 🚀 Get Customers who don't have Admin accounts (exclude NIC photos)
 */
export const getCustomersWithoutAdminService = async () => {
    const customers = await prisma.customer.findMany({
        where: { admin: { none: {} } },
        select: {
            customer_id: true,
            name: true,
            phone_number: true,
            email: true,
            nic: true,
        },
    });
    return customers.map(c => ({
        ...c,
        nic_photo_front: null,
        nic_photo_back: null,
    }));
};
/**
 * 🔹 Combined helper to get all users without Admin accounts
 */
export const getAllUsersWithoutAdminService = async () => {
    const drivers = await getDriversWithoutAdminService();
    const customers = await getCustomersWithoutAdminService();
    return { drivers, customers };
};
//# sourceMappingURL=adminRoleService.js.map