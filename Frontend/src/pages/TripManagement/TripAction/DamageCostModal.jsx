import React, { useState } from "react";
import api from "../../../utils/axiosInstance";

const DamageCostModal = ({ open, onClose, tripId, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submitDamage = async () => {
    if (!amount) return alert("Enter damage amount");

    try {
      setLoading(true);
      await api.patch(
        `/api/trips/${tripId}/damage`,
        { damage_amount: Number(amount) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onSuccess(); // refresh trip
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to add damage cost");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-xl w-80">
        <h2 className="text-xl font-semibold mb-4">Add Damage Cost</h2>

        <input
          type="number"
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Enter damage amount (Rs)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>

          <button
            onClick={submitDamage}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {loading ? "Saving..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DamageCostModal;
