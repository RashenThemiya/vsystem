import bcrypt from "bcryptjs";
import { prisma } from "../config/prismaClient.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export const registerAdmin = async (email: string, password: string, role: "Admin" | "SuperAdmin") => {
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) throw new Error("Admin already exists");

  const hashed = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.create({
    data: { email, password: hashed, role },
  });

  return admin;
};

export const loginAdmin = async (email: string, password: string) => {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, admin.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: admin.admin_id, role: admin.role }, JWT_SECRET, { expiresIn: "1d" });
  return { token, admin };
};
