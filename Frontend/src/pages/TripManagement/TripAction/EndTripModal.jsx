import React, { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";

const EndTripModal = ({ open, tripId, currentMeter, onClose, onSuccess }) => {
  const [endMeter, setEndMeter] = useState(currentMeter || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEndMeter(currentMeter || "");
  }, [currentMeter]);

  if (!open) return null;

  const handleEnd = async () => {
    if (!endMeter || isNaN(endMeter)) {
      return alert("Enter a valid end meter");
    }

    try {
      setLoading(true);
      await api.patch(
        `/api/trips/${tripId}/end`,
        { end_meter: Number(endMeter) },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to end trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/50 z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80">
        <h3 className="text-xl font-bold mb-4">End Trip</h3>
        <input
          type="number"
          placeholder="Enter end meter"
          value={endMeter}
          onChange={(e) => setEndMeter(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-4 border-gray-300"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">
            Cancel
          </button>
          <button
            onClick={handleEnd}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
          >
            {loading ? "Ending..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndTripModal;
