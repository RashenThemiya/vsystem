import React, { useState, useEffect } from "react";
import api from "../utils/axiosInstance";

const FuelEditModal = ({ open, onClose, fuel, onSuccess }) => {
  const [cost, setCost] = useState(fuel?.cost || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fuel) setCost(fuel.cost);
  }, [fuel]);

  if (!open) return null;

  const submitEdit = async () => {
    if (cost === "" || isNaN(cost)) return alert("Please enter a valid cost");

    try {
      setLoading(true);
      await api.put(
        `/api/fuels/${fuel.fuel_id}`, // ✅ use fuel_id
        { cost: Number(cost) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      onSuccess(); // refresh data
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update fuel cost");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50 p-4">
      <div className="bg-white p-6 rounded shadow-xl w-80">
        <h2 className="text-xl font-semibold mb-4">Edit Fuel Cost</h2>

        <label className="font-medium mb-2 block">Fuel Type</label>
        <input
          type="text"
          value={fuel.type}
          disabled
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 bg-gray-100"
        />

        <label className="font-medium mb-2 block">Cost</label>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={submitEdit}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuelEditModal;
