import { useState } from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { FiEdit } from "react-icons/fi";
import api from "../../utils/axiosInstance";

export default function EditDriverForm({ driver, onUpdated, onCancel }) {
  const [form, setForm] = useState({ ...driver });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [nicError, setNicError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // NIC Validation
  if (name === "nic") {
    const oldNIC = /^[0-9]{9}[vVxX]$/;
    const newNIC = /^[0-9]{12}$/;

    if (!oldNIC.test(value) && !newNIC.test(value)) {
      setNicError("Invalid NIC format.");
    } else {
      setNicError("");
    }
  }

  // Phone Validation (10 digits, starts with 0)
  if (name === "phone_number") {
    const phonePattern = /^0\d{9}$/;

    if (!phonePattern.test(value)) {
      setPhoneError("Phone must start with 0 and contain exactly 10 digits.");
    } else {
      setPhoneError("");
    }
  }
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, [key]: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    if (nicError || phoneError) {
    setError("Please fix the validation errors before submitting.");
    return;
    }

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
      setSuccessMsg("Driver updated successfully!");

      setTimeout(() => {
        setSuccessMsg("");
        onCancel();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update driver.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white-100">
    <div className="bg-white p-1 rounded-lg  w-full h-full max-w-md">
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-400 p-2 rounded mb-3">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-100 text-green-700 border border-green-400 p-2 rounded mb-3">
          {successMsg}
        </div>
      )}

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label className="block mb-1 text-gray-600">Driver Name:</label>
        <input
          type="text"
          name="name"
          label="Driver Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Driver Name"
        />

        <label className="block mb-1 text-gray-600">Phone Number:</label>
        <input
          type="text"
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Phone Number"
        />
        {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}

        <label className="block mb-1 text-gray-600">Driver Charges:</label>
        <input
          type="number"
          name="driver_charges"
          value={form.driver_charges}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Driver Charges"
        />

        <label className="block mb-1 text-gray-600">Driver NIC:</label>
        <input
          type="text"
          name="nic"
          value={form.nic}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="NIC"
        />
        {nicError && <p className="text-red-600 text-sm mt-1">{nicError}</p>}

        <label className="block mb-1 text-gray-600">Driver Age:</label>
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Age"
        />

        <label className="block mb-1 text-gray-600">License Number:</label>
        <input
          type="text"
          name="license_number"
          value={form.license_number}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="License Number"
        />

        <label className="block mb-1 text-gray-600">License Expiry Date:</label>
        <input
          type="date"
          name="license_expiry_date"
          value={form.license_expiry_date?.split("T")[0]}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />

        {/* Driver Image */}
        <div>
          <label className="block mb-1 text-gray-600">Driver Photo:</label>

          {form.image && (
            <img
              src={form.image}
              alt="Driver"
              className="w-full h-32 object-cover rounded border mb-2"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "image")}
            className="w-full p-2 border rounded"
          />
        </div>

        <ConfirmWrapper
          onConfirm={handleSave}
          message="Are you sure you want to update this driver?"
          confirmText="Yes, Update"
          cancelText="Cancel"
          icon={<FiEdit />}
          buttonBackgroundColor="bg-blue-600"
          buttonTextColor="text-white"
        >
          <button
            type="button"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </ConfirmWrapper>

        <button
          type="button"
          onClick={onCancel}
          className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </form>
    </div>
    </div>
  );
}
