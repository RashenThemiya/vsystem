import { prisma } from "../config/prismaClient.js";

type TripStatusCount = {
  month?: string;
  year?: number;
  trip_status: string;
  count: number;
};

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
    yearlyStatusCountsRaw
  ] = await Promise.all([
    prisma.trip.count(),
    prisma.vehicle.count(),
    prisma.customer.count(),
    prisma.owner.count(),
    prisma.bill_Upload.findMany({ where: { bill_status: "pending" }, select: { bill_id: true } }),
    prisma.trip.groupBy({ by: ["trip_status"], _count: { trip_id: true } }),
    prisma.fuel.findMany({ select: { fuel_id: true, type: true, cost: true } }),
    prisma.$queryRaw<TripStatusCount[]>`
      SELECT 
        DATE_FORMAT(leaving_datetime, '%Y-%m') AS month,
        trip_status,
        COUNT(*) AS count
      FROM Trip
      GROUP BY month, trip_status
      ORDER BY month ASC
    `,
    prisma.$queryRaw<TripStatusCount[]>`
      SELECT 
        YEAR(leaving_datetime) AS year,
        trip_status,
        COUNT(*) AS count
      FROM Trip
      GROUP BY year, trip_status
      ORDER BY year ASC
    `
  ]);

  const statusCounts: Record<string, number> = { Pending: 0, Ongoing: 0, Ended: 0, Completed: 0, Cancelled: 0 };
  tripStatusCounts.forEach(item => {
    statusCounts[item.trip_status] = Number(item._count.trip_id);
  });

  return {
    totalTrips: Number(totalTrips),
    totalVehicles: Number(totalVehicles),
    totalCustomers: Number(totalCustomers),
    totalOwners: Number(totalOwners),
    pendingBillsCount: pendingBills.length,
    tripStatusCounts: statusCounts,
    monthlyTripStatusCounts: monthlyStatusCountsRaw.map(r => ({
      month: r.month,
      trip_status: r.trip_status,
      count: Number(r.count),
    })),
    yearlyTripStatusCounts: yearlyStatusCountsRaw.map(r => ({
      year: Number(r.year),
      trip_status: r.trip_status,
      count: Number(r.count),
    })),
    fuelPrices: fuelList.map(f => ({
      fuel_id: Number(f.fuel_id),
      type: f.type,
      cost: Number(f.cost),
    })),
  };
};
