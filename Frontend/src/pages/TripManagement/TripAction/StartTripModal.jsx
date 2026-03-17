import React, { useState } from "react";
import api from "../../../utils/axiosInstance";
import Swal from "sweetalert2";

const StartTripModal = ({ open, tripId, onClose, onSuccess }) => {
  const [startMeter, setStartMeter] = useState("");
  const [loading, setLoading] = useState(false);
  const [meterImage, setMeterImage] = useState("");
  const [preview, setPreview] = useState("");


  if (!open) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setMeterImage(reader.result.split(",")[1]); // base64
    };
    reader.readAsDataURL(file);
  };


  const handleStart = async () => {
    if (!startMeter || isNaN(startMeter)) {
      return alert("Enter a valid start meter");
    }

    try {
      setLoading(true);
      await api.patch(
        `/api/trips/${tripId}/start`,
        { start_meter: Number(startMeter),
          start_meter_photo: meterImage || null
         },
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
        {/* Meter Image Upload (Optional) */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Meter Image (Optional)</label>

          <div className="mt-2 border-2 border-dashed rounded-lg h-32 flex items-center justify-center relative bg-gray-50 hover:bg-gray-100 transition">
            {preview ? (
              <img src={preview} className="h-full w-full object-cover rounded-lg" />
            ) : (
              <span className="text-gray-400 text-sm">Upload Meter Photo</span>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

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
