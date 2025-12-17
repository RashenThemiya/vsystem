import { useEffect, useState } from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import api from "../../utils/axiosInstance";
import EditVehicleForm from "./EditVehicle";
import { useNavigate } from "react-router-dom";

export default function VehicleDetails({ vehicle, onClose, onDelete, onUpdated }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...vehicle });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setForm({ ...vehicle });
    setEditMode(false);
    setError(null);
    setSuccessMsg("");
  }, [vehicle]);

  if (!vehicle) return null;

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const updateData = {
        name: form.name,
        vehicle_number: form.vehicle_number,
        type: form.type,
        owner_id: form.owner_id,
        fuel_type: form.fuel?.type,
        rent_cost_daily: form.rent_cost_daily,
        owner_cost_monthly: form.owner_cost_monthly,
        mileage_costs: form.mileage_costs,
        image: form.image,
        license_image: form.license_image,
        insurance_card_image: form.insurance_card_image,
        eco_test_image: form.eco_test_image,
        book_image: form.book_image,
      };

      const response = await api.put(
        `/api/vehicles/${vehicle.vehicle_id}`,
        updateData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      onUpdated(response.data.data);
      setEditMode(false);
      setSuccessMsg("Vehicle updated successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update vehicle.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/vehicles/${vehicle.vehicle_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onDelete(vehicle.vehicle_id);
      setSuccessMsg("Vehicle deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete vehicle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-100 h-full bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md overflow-auto h-full relative">

        {/* Error & Success Messages */}
        {error && (
          <div className="bg-red-100 text-red-800 border border-red-300 px-4 py-2 rounded text-center mb-4">
            ❌ {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded text-center mb-4">
            ✅ {successMsg}
          </div>
        )}

        {!editMode && (
          <div className="space-y-6">
            {/* Top Buttons */}
            <div className="absolute top-3 left-3 flex gap-3">
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 shadow"
                title="Close"
              >
                <FaTimes size={16} />
              </button>
              <button
                onClick={() => setEditMode(true)}
                className="p-2 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-700 shadow"
                title="Edit Vehicle"
              >
                <FaEdit size={16} />
              </button>
            </div>

            

            {/* Title & Vehicle Image */}
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Vehicle Profile</h2>
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-2xl bg-gray-200 shadow border flex items-center justify-center overflow-hidden cursor-pointer" 
                onClick={() => navigate(`/vehicles/${vehicle.vehicle_id}`)}
              >
                {vehicle.image ? (
                  <img src={vehicle.image} alt="Vehicle" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-gray-700">{vehicle.name?.charAt(0)?.toUpperCase() || "V"}</span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-black mt-3 cursor-pointer" onClick={() => navigate(`/vehicles/${vehicle.vehicle_id}`)}>
                {vehicle.name}
              </h3>
              <p className="text-sm text-gray-500">Vehicle ID: #{vehicle.vehicle_id}</p>
            </div>

            {/* Vehicle Details */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Details</h4>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <p><strong>Vehicle Number:</strong> <br /> {vehicle.vehicle_number || "-"}</p>
                <p><strong>Type:</strong> <br /> {vehicle.type || "-"}</p>
                <p><strong>Owner:</strong> <br /> {vehicle.owner?.owner_name || "-"}</p>
                <p><strong>Contact:</strong> <br /> {vehicle.owner?.contact_number || "-"}</p>
                <p><strong>Fuel Type:</strong> <br /> {vehicle.fuel?.type || "-"}</p>
                <p><strong>Daily Rent:</strong> <br /> {vehicle.rent_cost_daily || "-"}</p>
                <p><strong>Monthly Owner Cost:</strong> <br /> {vehicle.owner_cost_monthly || "-"}</p>
                <p><strong>Mileage Cost:</strong> <br /> {vehicle.mileage_costs?.[0] ? `Base: ${vehicle.mileage_costs[0].mileage_cost}, Additional: ${vehicle.mileage_costs[0].mileage_cost_additional}` : "-"}</p>
              </div>

             
            </div>
          </div>
        )}

        {editMode && (
          <EditVehicleForm
            vehicle={vehicle}
            onCancel={() => setEditMode(false)}
            onSuccess={(updated) => {
              onUpdated(updated);
              setEditMode(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
