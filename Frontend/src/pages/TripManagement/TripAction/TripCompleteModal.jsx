import React, { useState } from "react";
import api from "../../../utils/axiosInstance";

const TripCompleteModal = ({ open, onClose, tripId, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const completeTrip = async () => {
    try {
      setLoading(true);

      await api.patch(
        `/api/trips/${tripId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Trip completed successfully!");
      onSuccess(); // refresh trip
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to complete trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-white p-6 rounded shadow-xl w-80">
        <h2 className="text-xl font-semibold mb-4">Complete Trip</h2>

        <p className="mb-4 text-gray-700">
          Are you sure you want to mark this trip as <strong>Completed</strong>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={completeTrip}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Completing..." : "Complete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCompleteModal;
