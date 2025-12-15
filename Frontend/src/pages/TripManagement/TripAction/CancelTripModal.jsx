// CancelTripModal.jsx
import React, { useState } from "react";
import api from "../../../utils/axiosInstance";

const CancelTripModal = ({ open, onClose, tripId, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const cancelTrip = async () => {
    if (!window.confirm("Are you sure you want to cancel this trip?")) return;

    try {
      setLoading(true);
      await api.patch(
        `/api/trips/${tripId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      onSuccess(); // refresh trip
      onClose();   // close modal
      setTimeout(() => {
      alert("Trip Canceled!");
    }, 100);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to cancel trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white p-6 rounded shadow-xl w-96">
        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Cancel Trip
        </h2>
        <p className="mb-4">
          Are you sure you want to cancel this trip? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Close
          </button>

          <button
            onClick={cancelTrip}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {loading ? "Cancelling..." : "Cancel Trip"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelTripModal;
