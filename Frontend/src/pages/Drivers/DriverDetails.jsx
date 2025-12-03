import { useEffect, useState } from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import api from "../../utils/axiosInstance";
import EditDriverForm from "./EditDriverForm";

export default function DriverDetails({ driver, onClose, onDelete, onUpdated }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...driver });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

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

  // Save edited customer
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
        image:form.image,
      };

      const response = await api.put(
        `/api/drivers/${driver.driver_id}`,
        updateData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      onUpdated(response.data.data); // update parent
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

      onDelete(driver.driver_id); // update parent
      setSuccessMsg("Driver deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Driver to delete customer.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSave = () => {
    setIsConfirmed(true);
    handleSave();
  };

  return (
    <div className="flex justify-center items-center w-100 min-h-screen bg-gray-100">
      <div className="bg-white p-13 rounded-lg shadow-lg w-full h-full max-w-md overflow-auto max-h-full relative">
        <h2 className="text-xl font-semibold mb-5 text-center">
          {editMode ? "Edit Driver" : "Driver Details"}
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

        {!editMode && (
          <div className="space-y-4 text-gray-700">
            <p><strong>Name:</strong> {driver.name}</p>
            <p><strong>Phone:</strong> {driver.phone_number}</p>
            <p><strong>Driver Charges:</strong> {driver.phone_number}</p>
            <p><strong>NIC:</strong> {driver.nic}</p>
            <p><strong>Age:</strong> {driver.age}</p>
            <p><strong>License Number:</strong> {driver.license_number}</p>
            <p><strong>License Expiry Date:</strong> {driver.license_expiry_date ? new Date(driver.license_expiry_date).toISOString().split("T")[0] : "N/A"}</p>

            <div>
              <h3 className="font-bold mb-2">Image:</h3>
              {driver.image && (
                <img
                  src={driver.image}
                  className="w-full h-32 object-cover rounded border mb-2"
                  alt="NIC Front"
                />
              )}
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-gray-900 transition"
            >
              Edit Driver
            </button>

            <ConfirmWrapper
              onConfirm={handleDelete}
              onCancel={() => {}}
              message="Are you sure you want to delete this Driver?"
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
                Delete Driver
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

        {editMode && (
          <EditDriverForm
            driver={driver}
            onUpdated={(updatedDriver) => {
              onUpdated(updatedDriver);
              setEditMode(false);
            }}
            onCancel={() => setEditMode(false)}
          />
        )}

      </div>
    </div>
  );
}
