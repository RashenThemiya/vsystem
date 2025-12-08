// AlterDatesModal.jsx
import React, { useState } from "react";
import api from "../../../utils/axiosInstance";

const AlterDatesModal = ({ open, onClose, tripId, onSuccess }) => {
  const [leavingDate, setLeavingDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submitDates = async () => {
    if (!leavingDate || !returnDate)
      return alert("Please select both dates");

    try {
      setLoading(true);

      await api.patch(
        `/api/trips/${tripId}/update-dates`,
        {
          leaving_datetime: leavingDate,
          actual_return_datetime: returnDate,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      onSuccess(); // refresh trip
      onClose();   // close modal

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update dates");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-white p-6 rounded shadow-xl w-96">
        <h2 className="text-xl font-semibold mb-4">Alter Trip Dates</h2>

        {/* Leaving Date */}
        <label className="font-medium">Leaving Date</label>
        <input
          type="datetime-local"
          value={leavingDate}
          onChange={(e) => setLeavingDate(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        {/* Actual Return Date */}
        <label className="font-medium">Actual Return Date</label>
        <input
          type="datetime-local"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={submitDates}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlterDatesModal;
