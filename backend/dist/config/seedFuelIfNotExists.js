import { PrismaClient, FuelType } from "@prisma/client";
const prisma = new PrismaClient();
const defaultFuelData = [
    { type: FuelType.Diesel, cost: 400.0 },
    { type: FuelType.Octane92, cost: 370.0 },
    { type: FuelType.Octane95, cost: 390.0 },
    { type: FuelType.Kerosene, cost: 350.0 },
];
export async function seedFuelIfNotExists() {
    try {
        for (const fuel of defaultFuelData) {
            const existing = await prisma.fuel.findFirst({
                where: { type: fuel.type },
            });
            if (!existing) {
                await prisma.fuel.create({
                    data: {
                        type: fuel.type,
                        cost: fuel.cost,
                    },
                });
                console.log(`✅ Created default fuel: ${fuel.type} (${fuel.cost})`);
            }
        }
        console.log("✅ Fuel seeding check complete.");
    }
    catch (error) {
        console.error("❌ Error seeding fuel:", error);
    }
    finally {
        await prisma.$disconnect();
    }
}
//# sourceMappingURL=seedFuelIfNotExists.js.map