import React, { useState } from "react";
import api from "../../../utils/axiosInstance";
import Swal from "sweetalert2";


const AddPaymentModal = ({ open, onClose, tripId, onSuccess, paidAmount }) => {
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submitPayment = async () => {
    if (!amount || !paymentDate) {
      return alert("Amount and Payment Date are required.");
    }

    try {
      setLoading(true);

      await api.post(
        `/api/trips/${tripId}/payment`,
        {
          amount: Number(amount),
          payment_date: paymentDate, // "YYYY-MM-DD" format
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onSuccess(); // Refresh trip details
      onClose();
       Swal.fire({
               icon: "success",
               title: "Payment Added",
               timer: 2000,
               showConfirmButton: true,
             });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to add payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-white p-6 rounded shadow-xl w-80">
        <h2 className="text-xl font-semibold mb-4">Add Payment</h2>

        <input
          type="number"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          placeholder={paidAmount ? `Due Amount: Rs ${paidAmount}` : "Enter payment amount (Rs)"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="date"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>

          <button
            onClick={submitPayment}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded hover:bg-purple-700"
          >
            {loading ? "Saving..." : "Add Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;
