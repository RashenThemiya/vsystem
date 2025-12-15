import { useEffect, useState } from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import api from "../../utils/axiosInstance";
import EditDriverForm from "./EditDriverForm";
import { useNavigate } from "react-router-dom";

export default function DriverDetails({ driver, onClose, onDelete, onUpdated }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...driver });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setForm({ ...driver });
    setEditMode(false);
    setError(null);
    setSuccessMsg("");
  }, [driver]);

  if (!driver) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, [key]: reader.result });
    reader.readAsDataURL(file);
  };

  // Save edited driver
  const handleSave = async () => {
    if (!isConfirmed) return;
    setLoading(true);
    setError(null);

    try {
      const updateData = {
        name: form.name,
        phone_number: form.phone_number,
        driver_charges: form.driver_charges,
        nic: form.nic,
        age: form.age,
        license_number: form.license_number,
        license_expiry_date: form.license_expiry_date,
        image: form.image,
      };

      const response = await api.put(
        `/api/drivers/${driver.driver_id}`,
        updateData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      onUpdated(response.data.data);
      setEditMode(false);
      setIsConfirmed(false);

      setSuccessMsg("Driver updated successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update driver.");
      setIsConfirmed(false);
    } finally {
      setLoading(false);
    }
  };

  // Delete driver
  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/api/drivers/${driver.driver_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      onDelete(driver.driver_id);
      setSuccessMsg("Driver deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete driver.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSave = () => {
    setIsConfirmed(true);
    handleSave();
  };

  return (
    <div className="flex justify-center items-center w-100 h-full bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md overflow-auto h-full relative">
        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-800 border border-red-300 px-4 py-2 rounded text-center mb-4">
            ❌ {error}
          </div>
        )}

        {/* Success */}
        {successMsg && (
          <div className="bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded text-center mb-4">
            ✅ {successMsg}
          </div>
        )}

        {/* ------------ PROFILE VIEW MODE ------------ */}
        {!editMode && (
          <div className="space-y-6">
            {/* Top Action Bar */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-3">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 shadow"
                title="Close"
              >
                <FaTimes size={16} />
              </button>

              {/* Edit Button */}
              <button
                onClick={() => setEditMode(true)}
                className="p-2 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-700 shadow"
                title="Edit Driver"
              >
                <FaEdit size={16} />
              </button>
            </div>

            {/* Delete Button */}
            <div className="absolute top-3 right-3 z-10">
              <ConfirmWrapper
                onConfirm={handleDelete}
                message="Are you sure you want to delete this driver?"
                confirmText="Yes, Delete"
                cancelText="Cancel"
                icon={<FaTrash />}
                buttonBackgroundColor="bg-red-600"
                buttonTextColor="text-white"
              >
                <button
                  type="button"
                  className="p-2 rounded-full bg-red-200 hover:bg-red-300 text-red-700 shadow"
                  title="Delete Driver"
                  disabled={loading}
                >
                  <FaTrash size={16} />
                </button>
              </ConfirmWrapper>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Driver Profile
            </h2>

            {/* Avatar / Name */}
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full bg-gray-200 shadow border flex items-center justify-center overflow-hidden underline" 
              onClick={() => navigate(`/driver-profile/${driver.driver_id}`)}
              >
                {driver.image ? (
                  <img
                    src={driver.image}
                    alt="Driver"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-700">
                    {driver.name?.charAt(0)?.toUpperCase() || "D"}
                  </span>
                )}
              </div>

              <h3
                className="text-xl font-semibold text-black mt-3 cursor-pointer "
                onClick={() => navigate(`/driver-profile/${driver.driver_id}`)}
              >
                {driver.name}
              </h3>

              <p className="text-sm text-gray-500">Driver ID: #{driver.driver_id}</p>
            </div>

            {/* Details Section */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Details</h4>

              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <p><strong>Phone:</strong> <br /> {driver.phone_number || "-"}</p>
                <p><strong>Driver Charges:</strong> <br /> {driver.driver_charges || "-"}</p>
                <p><strong>NIC:</strong> <br /> {driver.nic || "-"}</p>
                <p><strong>Age:</strong> <br /> {driver.age || "-"}</p>
                <p><strong>License Number:</strong> <br /> {driver.license_number || "-"}</p>
                <p><strong>License Expiry:</strong> <br /> {driver.license_expiry_date ? new Date(driver.license_expiry_date).toISOString().split("T")[0] : "-"}</p>
              </div>
            </div>
          </div>
        )}

        {/* ------------ EDIT MODE ------------ */}
        {editMode && (
          <EditDriverForm
            driver={driver}
            onCancel={() => setEditMode(false)}
            onUpdated={(updated) => {
              onUpdated(updated);
              setEditMode(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
