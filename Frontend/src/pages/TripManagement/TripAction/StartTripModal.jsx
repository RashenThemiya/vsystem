import React, { useState } from "react";
import api from "../../../utils/axiosInstance";
import Swal from "sweetalert2";

const StartTripModal = ({ open, tripId, onClose, onSuccess }) => {
  const [startMeter, setStartMeter] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleStart = async () => {
    if (!startMeter || isNaN(startMeter)) {
      return alert("Enter a valid start meter");
    }

    try {
      setLoading(true);
      await api.patch(
        `/api/trips/${tripId}/start`,
        { start_meter: Number(startMeter) },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      onSuccess();
      onClose();
      Swal.fire({
              icon: "success",
              title: "Trip Started",
              timer: 2000,
              showConfirmButton: true,
            });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to start trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/50 z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80">
        <h3 className="text-xl font-bold mb-4">Start Trip</h3>
        <input
          type="number"
          placeholder="Enter start meter"
          value={startMeter}
          onChange={(e) => setStartMeter(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-4 border-gray-300"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
          >
            {loading ? "Starting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartTripModal;
