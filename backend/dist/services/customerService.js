import { prisma } from "../config/prismaClient.js";
/**
 * Helper: Convert base64 → Uint8Array<ArrayBuffer>
 */
const toPrismaBytes = (b64) => {
    if (!b64)
        return null;
    const buffer = Buffer.from(b64, "base64");
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    return new Uint8Array(arrayBuffer);
};
/**
 * Helper: Convert Prisma Bytes → Base64 string
 */
const fromPrismaBytes = (bytes) => {
    if (!bytes)
        return null;
    return `data:image/png;base64,${Buffer.from(bytes).toString("base64")}`;
};
/**
 * ✅ Create a new customer
 */
const phoneRegex = /^(?:\+94|0)?7\d{8}$/;
const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;
export const createCustomerService = async (data) => {
    const { name, nic, phone_number, email, nic_photo_front, nic_photo_back } = data;
    if (!name || !nic || !phone_number || !email) {
        throw new Error("Missing required fields: name, nic, phone_number, email");
    }
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing)
        throw new Error("Customer with this email already exists");
    // Phone validation
    { /*if (!phoneRegex.test(phone_number)) {
      throw new Error("Phone number must be 10 digits");
    }
  
    // NIC validation
    if (!nicRegex.test(nic)) {
      throw new Error("NIC must be 9 digits + V/v/X/x or 12 digits");
    }*/
    }
    const newCustomer = await prisma.customer.create({
        data: {
            name,
            nic,
            phone_number,
            email,
            nic_photo_front: nic_photo_front ? toPrismaBytes(nic_photo_front.split(",")[1]) : null,
            nic_photo_back: nic_photo_back ? toPrismaBytes(nic_photo_back.split(",")[1]) : null,
        },
    });
    // Convert NIC photos to base64 before sending to frontend
    return {
        ...newCustomer,
        nic_photo_front: fromPrismaBytes(newCustomer.nic_photo_front),
        nic_photo_back: fromPrismaBytes(newCustomer.nic_photo_back),
    };
};
/**
 * ✅ Get all customers (convert Bytes → Base64)
 */
export const getAllCustomersService = async () => {
    const customers = await prisma.customer.findMany();
    return customers.map((c) => ({
        ...c,
        nic_photo_front: fromPrismaBytes(c.nic_photo_front),
        nic_photo_back: fromPrismaBytes(c.nic_photo_back),
    }));
};
/**
 * ✅ Get single customer by ID
 */
export const getCustomerByIdService = async (id) => {
    const customer = await prisma.customer.findUnique({
        where: { customer_id: id },
        include: {
            trips: {
                include: {
                    map: {
                        orderBy: { sequence: "asc" },
                    },
                    payments: {
                        orderBy: {
                            payment_date: "asc", // or "desc"
                        },
                    },
                },
            },
        },
    });
    if (!customer)
        throw new Error("Customer not found");
    return {
        ...customer,
        nic_photo_front: fromPrismaBytes(customer.nic_photo_front),
        nic_photo_back: fromPrismaBytes(customer.nic_photo_back),
    };
};
/**
 * ✅ Update customer by ID
 */
export const updateCustomerService = async (id, data) => {
    const existing = await prisma.customer.findUnique({
        where: { customer_id: id },
    });
    if (!existing)
        throw new Error("Customer not found");
    //  Validate phone only if user tries to update it
    { /*if (data.phone_number && !phoneRegex.test(data.phone_number)) {
      throw new Error("Phone number must be 10 digits");
    }
  
    //  Validate NIC only if user updates it
    if (data.nic && !nicRegex.test(data.nic)) {
      throw new Error("NIC must be 9 digits + V/v/X/x or 12 digits");
    }*/
    }
    const updateData = {
        name: data.name ?? existing.name,
        nic: data.nic ?? existing.nic,
        phone_number: data.phone_number ?? existing.phone_number,
        email: data.email ?? existing.email,
        nic_photo_front: data.nic_photo_front && data.nic_photo_front.startsWith("data:image")
            ? toPrismaBytes(data.nic_photo_front.split(",")[1])
            : undefined, // keep existing
        nic_photo_back: data.nic_photo_back && data.nic_photo_back.startsWith("data:image")
            ? toPrismaBytes(data.nic_photo_back.split(",")[1])
            : undefined, // keep existing
    };
    const updated = await prisma.customer.update({
        where: { customer_id: id },
        data: updateData,
    });
    return {
        ...updated,
        nic_photo_front: fromPrismaBytes(updated.nic_photo_front),
        nic_photo_back: fromPrismaBytes(updated.nic_photo_back),
    };
};
/**
 * ✅ Delete customer by ID
 */
export const deleteCustomerService = async (id) => {
    // Delete all trips of the customer (cascade delete dependent tables manually)
    await prisma.trip.deleteMany({
        where: { customer_id: id },
    });
    // Now delete the customer
    await prisma.customer.delete({ where: { customer_id: id } });
    return true;
};
export const getCustomerKpiService = async (customerId) => {
    // Fetch trips of the customer
    const trips = await prisma.trip.findMany({
        where: { customer_id: customerId },
        select: {
            payment_status: true,
            trip_status: true,
        },
    });
    if (!trips || trips.length === 0) {
        return {
            pieChart: { Paid: 0, Partially_Paid: 0, Unpaid: 0 },
            barChart: { Pending: 0, Ongoing: 0, Ended: 0, Completed: 0, Cancelled: 0 },
        };
    }
    // Pie chart: Payment status counts
    const pieChart = trips.reduce((acc, trip) => {
        if (trip.payment_status === "Paid")
            acc.Paid += 1;
        else if (trip.payment_status === "Partially_Paid")
            acc.Partially_Paid += 1;
        else if (trip.payment_status === "Unpaid")
            acc.Unpaid += 1;
        return acc;
    }, { Paid: 0, Partially_Paid: 0, Unpaid: 0 });
    // Bar chart: Trip status counts
    const barChart = trips.reduce((acc, trip) => {
        const status = trip.trip_status;
        if (!acc[status])
            acc[status] = 0;
        acc[status] += 1;
        return acc;
    }, { Pending: 0, Ongoing: 0, Ended: 0, Completed: 0, Cancelled: 0 });
    return { pieChart, barChart };
};
//# sourceMappingURL=customerService.js.map