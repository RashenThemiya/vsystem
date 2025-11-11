import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const createSuperAdmin = async () => {
  const email = "superadmin@example.com";
  const password = "SuperAdmin@123";
  const role = "SuperAdmin";

  const existingAdmin = await prisma.admin.findUnique({ where: { email } });
  if (existingAdmin) {
    console.log("✅ Super Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });

  console.log("🚀 Default Super Admin created successfully");
};
