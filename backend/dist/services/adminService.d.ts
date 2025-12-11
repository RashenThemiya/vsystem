export declare const registerAdmin: (email: string, password: string, role: "Admin" | "SuperAdmin") => Promise<{
    email: string;
    password: string;
    role: import(".prisma/client").$Enums.Role;
    admin_id: number;
    driver_id: number | null;
    customer_id: number | null;
}>;
export declare const loginAdmin: (email: string, password: string) => Promise<{
    token: string;
    admin: {
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        admin_id: number;
        driver_id: number | null;
        customer_id: number | null;
    };
}>;
//# sourceMappingURL=adminService.d.ts.map