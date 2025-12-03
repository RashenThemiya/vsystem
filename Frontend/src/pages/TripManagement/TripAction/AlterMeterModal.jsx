import React, { useState } from "react";
import api from "../../../utils/axiosInstance";

const AlterMeterModal = ({ open, onClose, tripId, onSuccess }) => {
  const [startMeter, setStartMeter] = useState("");
  const [endMeter, setEndMeter] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submitMeters = async () => {
    if (!startMeter || !endMeter)
      return alert("Please enter both Start and End meter readings");

    try {
      setLoading(true);

      await api.patch(
        `/api/trips/${tripId}/update-meter`,
        {
          start_meter: Number(startMeter),
          end_meter: Number(endMeter),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update meter readings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-xl w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Alter Meter Readings</h2>

        {/* Start Meter */}
        <label className="font-medium">Start Meter</label>
        <input
          type="number"
          value={startMeter}
          onChange={(e) => setStartMeter(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Enter start meter"
        />

        {/* End Meter */}
        <label className="font-medium">End Meter</label>
        <input
          type="number"
          value={endMeter}
          onChange={(e) => setEndMeter(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Enter end meter"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={submitMeters}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlterMeterModal;
