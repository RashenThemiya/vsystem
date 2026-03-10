import React, { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import Swal from "sweetalert2";

const AlterDriverCostModal = ({ open, onClose, tripId, onSuccess, currentDriverCost }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Prefill current driver cost when modal opens
  useEffect(() => {
    if (open) {
      setAmount(currentDriverCost ? String(Number(currentDriverCost)) : "");
    }
  }, [open, currentDriverCost]);

  if (!open) return null;

  const submitDriverCost = async () => {
    if (!amount) return alert("Enter driver cost");

    try {
      setLoading(true);
      await api.patch(
        `/api/trips/${tripId}/driver-cost`,
        { driver_cost: Number(amount) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onSuccess(); // refresh trip
      onClose();

      Swal.fire({
        icon: "success",
        title: "Driver cost updated",
        timer: 2000,
        showConfirmButton: true,
      });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update driver cost");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-white p-6 rounded shadow-xl w-80">
        <h2 className="text-xl font-semibold mb-4">Alter Driver Cost</h2>

        <input
          type="number"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="Enter driver cost (Rs)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>

          <button
            onClick={submitDriverCost}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded hover:bg-indigo-700"
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlterDriverCostModal;