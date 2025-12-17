// src/services/paymentService.ts
import { prisma } from "../config/prismaClient.js";
import { PaymentStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";

/**
 * Delete a payment and update trip accordingly
 */
export const deletePaymentService = async (payment_id: number) => {
  // 1️⃣ Fetch the payment with its trip
  const payment = await prisma.payment.findUnique({
    where: { payment_id },
    include: { trip: true },
  });

  if (!payment) throw new Error("Payment not found");

  const trip = payment.trip;

  if (!trip) throw new Error("Associated trip not found");

  const paymentAmount = Number(payment.amount);

  // 2️⃣ Delete the payment
  await prisma.payment.delete({
    where: { payment_id },
  });

  // 3️⃣ Recalculate trip payment_amount
  const newPaymentAmount = Number(trip.payment_amount || 0) - paymentAmount;

  // 4️⃣ Recalculate payment_status
  let newPaymentStatus: PaymentStatus = PaymentStatus.Unpaid;
  if (newPaymentAmount >= Number(trip.total_actual_cost || 0)) {
    newPaymentStatus = PaymentStatus.Paid;
  } else if (newPaymentAmount > 0) {
    newPaymentStatus = PaymentStatus.Partially_Paid;
  } else {
    newPaymentStatus = PaymentStatus.Unpaid;
  }

  // 5️⃣ Update the trip
  const updatedTrip = await prisma.trip.update({
    where: { trip_id: trip.trip_id },
    data: {
      payment_amount: new Prisma.Decimal(newPaymentAmount),
      payment_status: newPaymentStatus,
    },
  });

  return {
    message: "Payment deleted successfully",
    updatedTrip,
  };
};
