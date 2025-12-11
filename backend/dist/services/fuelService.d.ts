/**
 * ✅ Create new fuel record
 */
export declare const createFuelService: (data: any) => Promise<{
    type: import(".prisma/client").$Enums.FuelType;
    fuel_id: number;
    cost: import("@prisma/client/runtime/library.js").Decimal;
}>;
/**
 * ✅ Get all fuels
 */
export declare const getAllFuelsService: () => Promise<{
    type: import(".prisma/client").$Enums.FuelType;
    fuel_id: number;
    cost: import("@prisma/client/runtime/library.js").Decimal;
}[]>;
/**
 * ✅ Get single fuel by ID
 */
export declare const getFuelByIdService: (id: number) => Promise<{
    type: import(".prisma/client").$Enums.FuelType;
    fuel_id: number;
    cost: import("@prisma/client/runtime/library.js").Decimal;
}>;
/**
 * ✅ Update fuel by ID
 */
export declare const updateFuelService: (id: number, data: any) => Promise<{
    type: import(".prisma/client").$Enums.FuelType;
    fuel_id: number;
    cost: import("@prisma/client/runtime/library.js").Decimal;
}>;
/**
 * ✅ Delete fuel by ID
 */
export declare const deleteFuelService: (id: number) => Promise<boolean>;
//# sourceMappingURL=fuelService.d.ts.map