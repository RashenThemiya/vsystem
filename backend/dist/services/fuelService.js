import { prisma } from "../config/prismaClient.js";
/**
 * ✅ Create new fuel record
 */
export const createFuelService = async (data) => {
    const { type, cost } = data;
    if (!type || cost === undefined) {
        throw new Error("Missing required fields: type, cost");
    }
    const existingFuel = await prisma.fuel.findFirst({
        where: { type },
    });
    if (existingFuel) {
        throw new Error(`Fuel type '${type}' already exists`);
    }
    const newFuel = await prisma.fuel.create({
        data: {
            type,
            cost: parseFloat(cost),
        },
    });
    return newFuel;
};
/**
 * ✅ Get all fuels
 */
export const getAllFuelsService = async () => {
    return await prisma.fuel.findMany({
        orderBy: { fuel_id: "asc" },
    });
};
/**
 * ✅ Get single fuel by ID
 */
export const getFuelByIdService = async (id) => {
    const fuel = await prisma.fuel.findUnique({
        where: { fuel_id: id },
    });
    if (!fuel)
        throw new Error("Fuel not found");
    return fuel;
};
/**
 * ✅ Update fuel by ID
 */
export const updateFuelService = async (id, data) => {
    const existing = await prisma.fuel.findUnique({ where: { fuel_id: id } });
    if (!existing)
        throw new Error("Fuel not found");
    const updatedFuel = await prisma.fuel.update({
        where: { fuel_id: id },
        data: {
            type: data.type ?? existing.type,
            cost: data.cost !== undefined ? parseFloat(data.cost) : existing.cost,
        },
    });
    return updatedFuel;
};
/**
 * ✅ Delete fuel by ID
 */
export const deleteFuelService = async (id) => {
    const existing = await prisma.fuel.findUnique({ where: { fuel_id: id } });
    if (!existing)
        throw new Error("Fuel not found");
    await prisma.fuel.delete({ where: { fuel_id: id } });
    return true;
};
//# sourceMappingURL=fuelService.js.map