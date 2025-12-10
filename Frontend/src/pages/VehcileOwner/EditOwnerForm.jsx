import { useState } from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import api from "../../utils/axiosInstance";
import { FaTimes, FaCheck } from "react-icons/fa";

export default function EditOwnerForm({ owner, onUpdated, onCancel }) {
  const [form, setForm] = useState({ ...owner });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone number validation
    if (name === "contact_number") {
      const phonePattern = /^0\d{9}$/;
      setPhoneError(!phonePattern.test(value) ? "Phone must start with 0 and contain 10 digits." : "");
    }

    setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
    if (phoneError) {
      setError("Please fix validation errors before saving.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData = {
        owner_name: form.owner_name,
        contact_number: form.contact_number,
      };

      const response = await api.put(
        `/api/owners/${owner.owner_id}`,
        updateData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      onUpdated(response.data.data);
      setSuccessMsg("Owner updated successfully!");

      setTimeout(() => {
        setSuccessMsg("");
        onCancel();
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update owner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-2 w-full max-w-md overflow-auto relative">

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
          message="Are you sure you want to update this owner?"
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

      {/* Error / Success Alerts */}
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
        Edit Owner
      </h2>

      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>

        {/* Owner Name */}
        <label className="block text-gray-600 font-medium">Owner Name:</label>
        <input
          type="text"
          name="owner_name"
          value={form.owner_name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Owner Name"
        />

        {/* Contact Number */}
        <label className="block text-gray-600 font-medium">Contact Number:</label>
        <input
          type="text"
          name="contact_number"
          value={form.contact_number}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="07XXXXXXXX"
        />
        {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}

      </form>
    </div>
  );
}
