import { useState } from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import api from "../../utils/axiosInstance";
import { FaTimes, FaCheck } from "react-icons/fa";

export default function EditDriverForm({ driver, onUpdated, onCancel }) {

  //console.log("EditDriverForm props:", { driver, onUpdated, onCancel });

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
      setNicError(!oldNIC.test(value) && !newNIC.test(value) ? "Invalid NIC format." : "");
    }

    // Phone Validation (10 digits, starts with 0)
    if (name === "phone_number") {
      const phonePattern = /^0\d{9}$/;
      setPhoneError(!phonePattern.test(value) ? "Phone must start with 0 and contain 10 digits." : "");
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
  if (nicError || phoneError) {
    setError("Please fix validation errors before saving.");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const response = await api.put(
      `/api/drivers/${driver.driver_id}`,
      {
        name: form.name,
        phone_number: form.phone_number,
        driver_charges: form.driver_charges,
        nic: form.nic,
        age: form.age,
        license_number: form.license_number,
        license_expiry_date: form.license_expiry_date,
        image: form.image,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const updatedDriver =
      response.data?.data ||
      response.data?.driver ||
      response.data;

    onUpdated(updatedDriver); // ✅ NOW SAFE
    setSuccessMsg("Driver updated successfully!");

    setTimeout(() => {
      setSuccessMsg("");
      onCancel();
    }, 1000);
  } catch (err) {
    console.error("Update driver error:", err);
    console.error("Response data:", err.response?.data);
    setError(err.response?.data?.message || "Failed to update driver.");
  } finally {
    setLoading(false);
  }
};


  return (
    
      <div className="bg-white p-3 h-220 w-full max-w-md overflow-auto relative">

        {/* Top Left: Close */}
        <div className="absolute top-3 left-3 z-10">
          <button
            onClick={onCancel}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 shadow"
            title="Close"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Top Right: Confirm */}
        <div className="absolute top-3 right-3 z-10">
          <ConfirmWrapper
            onConfirm={handleSave}
            message="Are you sure you want to update this driver?"
            confirmText="Yes, Update"
            cancelText="Cancel"
            icon={<FaCheck />}
            buttonBackgroundColor="bg-green-600"
            buttonTextColor="text-white"
          >
            <button
              type="button"
              className="p-2 rounded-full bg-green-200 hover:bg-green-300 text-green-700 shadow"
              disabled={loading}
              title="Confirm"
            >
              <FaCheck size={16} />
            </button>
          </ConfirmWrapper>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded text-center mb-4 mt-12">
            ❌ {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-2 rounded text-center mb-4 mt-12">
            ✅ {successMsg}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Edit Driver
        </h2>

        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <label className="block text-gray-600 font-medium">Driver Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Driver Name"
          />

          <label className="block text-gray-600 font-medium">Phone Number:</label>
          <input
            type="text"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Phone Number"
          />
          {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}

          <label className="block text-gray-600 font-medium">Driver Charges:</label>
          <input
            type="number"
            name="driver_charges"
            value={form.driver_charges}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Driver Charges"
          />

          <label className="block text-gray-600 font-medium">Driver NIC:</label>
          <input
            type="text"
            name="nic"
            value={form.nic}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="NIC"
          />
          {nicError && <p className="text-red-600 text-sm mt-1">{nicError}</p>}

          <label className="block text-gray-600 font-medium">Driver Age:</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Age"
          />

          <label className="block text-gray-600 font-medium">License Number:</label>
          <input
            type="text"
            name="license_number"
            value={form.license_number}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="License Number"
          />

          <label className="block text-gray-600 font-medium">License Expiry Date:</label>
          <input
            type="date"
            name="license_expiry_date"
            value={form.license_expiry_date?.split("T")[0]}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />

          <div>
            <label className="block text-gray-600 font-medium mb-1">Driver Photo:</label>
            {form.image && (
              <img
                src={form.image}
                alt="Driver"
                className="w-full h-32 object-cover rounded-lg border mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image")}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </form>
      </div>
    
  );
}
