import { prisma } from "../config/prismaClient.js";

/* ================= TYPES ================= */

type TripStatusCount = {
  month?: string;
  year?: number;
  trip_status: string;
  count: number;
};

type TripProfitAgg = {
  month?: string;
  year?: number;
  total_profit: number;
};

/* ================= SERVICE ================= */

export const getDashboardKPIs = async () => {
  const [
    totalTrips,
    totalVehicles,
    totalCustomers,
    totalOwners,

    pendingBills,

    tripStatusCounts,

    fuelList,

    monthlyStatusCountsRaw,
    yearlyStatusCountsRaw,

    // 🔥 PROFIT
    monthlyProfitRaw,
    yearlyProfitRaw,
  ] = await Promise.all([
    /* ---------- BASIC COUNTS ---------- */
    prisma.trip.count(),
    prisma.vehicle.count(),
    prisma.customer.count(),
    prisma.owner.count(),

    /* ---------- PENDING BILLS ---------- */
    prisma.bill_Upload.findMany({
      where: { bill_status: "pending" },
      select: { bill_id: true },
    }),

    /* ---------- TRIP STATUS COUNTS ---------- */
    prisma.trip.groupBy({
      by: ["trip_status"],
      _count: { trip_id: true },
    }),

    /* ---------- FUEL LIST ---------- */
    prisma.fuel.findMany({
      select: { fuel_id: true, type: true, cost: true },
    }),

    /* ---------- MONTHLY STATUS ---------- */
    prisma.$queryRaw<TripStatusCount[]>`
      SELECT 
        DATE_FORMAT(leaving_datetime, '%Y-%m') AS month,
        trip_status,
        COUNT(*) AS count
      FROM Trip
      GROUP BY month, trip_status
      ORDER BY month ASC
    `,

    /* ---------- YEARLY STATUS ---------- */
    prisma.$queryRaw<TripStatusCount[]>`
      SELECT 
        YEAR(leaving_datetime) AS year,
        trip_status,
        COUNT(*) AS count
      FROM Trip
      GROUP BY year, trip_status
      ORDER BY year ASC
    `,

    /* ================= PROFIT ================= */

    /* ---------- MONTHLY PROFIT ---------- */
    prisma.$queryRaw<TripProfitAgg[]>`
      SELECT 
        DATE_FORMAT(leaving_datetime, '%Y-%m') AS month,
        SUM(COALESCE(profit, 0)) AS total_profit
      FROM Trip
      WHERE trip_status = 'Completed'
      GROUP BY month
      ORDER BY month ASC
    `,

    /* ---------- YEARLY PROFIT ---------- */
    prisma.$queryRaw<TripProfitAgg[]>`
      SELECT 
        YEAR(leaving_datetime) AS year,
        SUM(COALESCE(profit, 0)) AS total_profit
      FROM Trip
      WHERE trip_status = 'Completed'
      GROUP BY year
      ORDER BY year ASC
    `,
  ]);

  /* ---------- FORMAT STATUS COUNTS ---------- */
  const statusCounts: Record<string, number> = {
    Pending: 0,
    Ongoing: 0,
    Ended: 0,
    Completed: 0,
    Cancelled: 0,
  };

  tripStatusCounts.forEach((item) => {
    statusCounts[item.trip_status] = Number(item._count.trip_id);
  });

  /* ================= RETURN ================= */

  return {
    /* ---------- TOP KPIs ---------- */
    totalTrips: Number(totalTrips),
    totalVehicles: Number(totalVehicles),
    totalCustomers: Number(totalCustomers),
    totalOwners: Number(totalOwners),
    pendingBillsCount: pendingBills.length,

    /* ---------- STATUS ---------- */
    tripStatusCounts: statusCounts,

    monthlyTripStatusCounts: monthlyStatusCountsRaw.map((r) => ({
      month: r.month,
      trip_status: r.trip_status,
      count: Number(r.count),
    })),

    yearlyTripStatusCounts: yearlyStatusCountsRaw.map((r) => ({
      year: Number(r.year),
      trip_status: r.trip_status,
      count: Number(r.count),
    })),

    /* ---------- PROFIT ---------- */
    monthlyTripProfit: monthlyProfitRaw.map((r) => ({
      month: r.month,
      total_profit: Number(r.total_profit),
    })),

    yearlyTripProfit: yearlyProfitRaw.map((r) => ({
      year: Number(r.year),
      total_profit: Number(r.total_profit),
    })),

    /* ---------- FUEL ---------- */
    fuelPrices: fuelList.map((f) => ({
      fuel_id: Number(f.fuel_id),
      type: f.type,
      cost: Number(f.cost),
    })),
  };
};

/* ================= TYPES ================= */

type ExpiryNotification = {
  vehicle_id: number;
  vehicle_number: string;
  expiry_type: "License" | "Insurance" | "Eco Test";
  expiry_date: Date;
  days_remaining: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
};

/* ================= SERVICE ================= */

export const getVehicleExpiryNotifications = async (): Promise<ExpiryNotification[]> => {
  const vehicles = await prisma.vehicle.findMany({
    select: {
      vehicle_id: true,
      vehicle_number: true,
      license_expiry_date: true,
      insurance_expiry_date: true,
      eco_test_expiry_date: true,
    },
  });

  const today = new Date();

  const notifications: ExpiryNotification[] = [];

  /* ---------- HELPER FUNCTION ---------- */
  const processExpiry = (
    vehicle: any,
    expiryDate: Date | null,
    type: "License" | "Insurance" | "Eco Test"
  ) => {
    if (!expiryDate) return;

    const diffTime = expiryDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let priority: "HIGH" | "MEDIUM" | "LOW" | null = null;

    if (daysRemaining < 0) {
      priority = "HIGH"; // expired
    } else if (daysRemaining <= 7) {
      priority = "MEDIUM"; // within 1 week
    } else if (daysRemaining <= 30) {
      priority = "LOW"; // within 1 month
    }

    if (!priority) return;

    notifications.push({
      vehicle_id: vehicle.vehicle_id,
      vehicle_number: vehicle.vehicle_number,
      expiry_type: type,
      expiry_date: expiryDate,
      days_remaining: daysRemaining,
      priority,
    });
  };

  /* ---------- PROCESS ALL VEHICLES ---------- */
  vehicles.forEach((vehicle) => {
    processExpiry(vehicle, vehicle.license_expiry_date, "License");
    processExpiry(vehicle, vehicle.insurance_expiry_date, "Insurance");
    processExpiry(vehicle, vehicle.eco_test_expiry_date, "Eco Test");
  });

  /* ---------- SORT: HIGH → MEDIUM → LOW ---------- */
  const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };

  notifications.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return notifications;
};