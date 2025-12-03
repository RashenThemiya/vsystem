import { useState } from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { FiEdit } from "react-icons/fi";
import api from "../../utils/axiosInstance";

export default function EditOwnerForm({ owner, onUpdated, onCancel }) {
  const [form, setForm] = useState({ ...owner });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^0\d{9}$/; // starts with 0 + total 10 digits
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contact_number") {
      if (!validatePhoneNumber(value)) {
        setPhoneError("Phone number must be 10 digits and start with 0");
      } else {
        setPhoneError("");
      }
    }

    setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    if (!validatePhoneNumber(form.contact_number)) {
      setError("Invalid phone number. It must be exactly 10 digits and start with 0.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.put(
        `/api/owners/${owner.owner_id}`,
        {
          owner_name: form.owner_name,
          contact_number: form.contact_number,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      onUpdated(response.data.data);
      setSuccessMsg("Owner updated successfully!");

      setTimeout(() => {
        setSuccessMsg("");
        onCancel();
      }, 800);
    } catch (err) {
      setError("Failed to update owner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-100 min-w-60 max-w-200 bg-white-100">
      <div className="bg-white p-1 rounded-lg w-full h-full">
        <h2 className="text-xl font-semibold mb-3 text-center">Edit Owner</h2>
        <br />

        {error && <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</div>}
        {successMsg && <div className="bg-green-100 text-green-700 p-2 mb-3 rounded">{successMsg}</div>}

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          
          {/* Owner Name */}
          <label className="block mb-1 text-gray-600">Owner Name:</label>
          <input
            type="text"
            name="owner_name"
            value={form.owner_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Owner Name"
          />

          {/* Contact Number */}
          <label className="block mb-1 text-gray-600">Contact Number:</label>
          <input
            type="text"
            name="contact_number"
            value={form.contact_number}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg ${
              phoneError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="07XXXXXXXX"
          />

          {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}

          <br />

          <ConfirmWrapper
            onConfirm={handleSave}
            message="Update this owner?"
            confirmText="Yes, Update"
            cancelText="Cancel"
            icon={<FiEdit />}
            buttonBackgroundColor="bg-blue-600"
            buttonTextColor="text-white"
          >
            <button className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </ConfirmWrapper>

          <button
            onClick={onCancel}
            className="w-full bg-gray-500 text-white py-2 rounded mt-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
