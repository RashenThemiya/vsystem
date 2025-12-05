import { useEffect, useState } from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import api from "../../utils/axiosInstance";
import EditVehicleForm from "./EditVehicle";
import { Link } from "react-router-dom";

export default function VehicleDetails({ vehicle, onClose, onDelete, onUpdated, onEdit }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...vehicle });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setForm({ ...vehicle });
    setEditMode(false);
    setError(null);
    setSuccessMsg("");
  }, [vehicle]);

  if (!vehicle) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
    if (!isConfirmed) return;

    setLoading(true);
    setError(null);

    try {
      const updateData = {
        vehicle_number: form.vehicle_number,
        vehicle_type: form.vehicle_type,
        owner_id: form.owner_id,
      };

      const response = await api.put(
        `/api/vehicles/${vehicle.vehicle_id}`,
        updateData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      onUpdated(response.data.data);
      setEditMode(false);
      setIsConfirmed(false);

      setSuccessMsg("Vehicle updated successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update vehicle.");
      setIsConfirmed(false);
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

  const handleConfirmSave = () => {
    setIsConfirmed(true);
    handleSave();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white-100">
      <div className="bg-white p-10 rounded-lg  w-full h-full max-w-600px overflow-auto max-h-full relative">
        
        <h2 className="text-xl font-semibold mb-6 text-center">
          {editMode ? "Edit Vehicle" : "Vehicle Details"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
            ❌ {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-center">
            ✅ {successMsg}
          </div>
        )}

        {/* ----------- VIEW MODE ----------- */}
        {!editMode && (
          <div className="space-y-4 text-gray-700">
            <p><strong>Vehicle:</strong> {vehicle.name}</p>
            <p>
              <strong>Vehicle Number:</strong>{" "}
              <Link
                to={`/vehicles/${vehicle.vehicle_id}`}
                className="text-blue-600 underline hover:text-blue-800"
              >
                {vehicle.vehicle_number}
              </Link>
            </p>
            <p><strong>Vehicle Type:</strong> {vehicle.type}</p>
            <p><strong>Fuel Type:</strong> {vehicle.fuel?.type}</p>
            <p><strong>Owner Name:</strong> {vehicle.owner?.owner_name}</p>
            <p><strong>Contact:</strong> {vehicle.owner?.contact_number}</p>
            <p><strong>Daily Rent Cost:</strong> {vehicle.rent_cost_daily}</p>
            <p><strong>Monthly Owner Cost:</strong> {vehicle.owner_cost_monthly}</p>
            <p><strong>Mileage Cost:</strong> {vehicle.mileage_costs.length > 0 ? (
                        <ul className="list-disc ml-4">
                          {vehicle.mileage_costs.map((m) => (
                            <li key={m.mileage_cost_id}>
                              Base: {m.mileage_cost}, Additional: {m.mileage_cost_additional}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400">No data</span>
                      )}</p>
            

            <div>
  <h3 className="font-bold mb-2">Images:</h3>

  {vehicle.image && (
    <div>
      <p className="font-semibold">Main Image:</p>
      <img
        src={`data:image/jpeg;base64,${vehicle.image}`}
        className="w-full h-40 object-cover rounded border mb-3"
        alt="main vehicle"
      />
    </div>
  )}

  {vehicle.license_image && (
    <div>
      <p className="font-semibold">License Image:</p>
      <img
        src={`data:image/jpeg;base64,${vehicle.license_image}`}
        className="w-full h-40 object-cover rounded border mb-3"
        alt="license"
      />
    </div>
  )}

  {vehicle.insurance_card_image && (
    <div>
      <p className="font-semibold">Insurance Card:</p>
      <img
        src={`data:image/jpeg;base64,${vehicle.insurance_card_image}`}
        className="w-full h-40 object-cover rounded border mb-3"
        alt="insurance"
      />
    </div>
  )}

  {vehicle.eco_test_image && (
    <div>
      <p className="font-semibold">Eco Test Image:</p>
      <img
        src={`data:image/jpeg;base64,${vehicle.eco_test_image}`}
        className="w-full h-40 object-cover rounded border mb-3"
        alt="eco test"
      />
    </div>
  )}

  {vehicle.book_image && (
    <div>
      <p className="font-semibold">Book Image:</p>
      <img
        src={`data:image/jpeg;base64,${vehicle.book_image}`}
        className="w-full h-40 object-cover rounded border mb-3"
        alt="book"
      />
    </div>
  )}
</div>

            <button
              onClick={() => {
                onEdit(); // call the dashboard handler to open modal
              }}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-gray-900 transition"
            >
              Edit Vehicle
            </button>

            <ConfirmWrapper
              onConfirm={handleDelete}
              onCancel={() => {}}
              message="Are you sure you want to delete this vehicle?"
              confirmText="Yes, Delete"
              cancelText="Cancel"
              icon={<FiTrash2 />}
              buttonBackgroundColor="bg-red-600"
              buttonTextColor="text-white"
            >
              <button
                type="button"
                className="w-full py-2 bg-black text-white rounded-lg hover:bg-red-700 transition"
                disabled={loading}
              >
                Delete Vehicle
              </button>
            </ConfirmWrapper>

            <button
              onClick={onClose}
              className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        )}

        {/* ----------- EDIT MODE ----------- */}
        {editMode && (
          <EditVehicleForm
            vehicle={vehicle}
            onUpdated={(updatedVehicle) => {
              onUpdated(updatedVehicle);
              setEditMode(false);
            }}
            onCancel={() => setEditMode(false)}
          />
        )}
      </div>
    </div>
  );
}
