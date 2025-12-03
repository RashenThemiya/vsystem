import { useState, useEffect } from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { FiEdit } from "react-icons/fi";
import api from "../../utils/axiosInstance";

export default function EditCustomerForm({ customer, onCancel, onSuccess }) {
  const [form, setForm] = useState({ ...customer });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // NEW
  const [nicError, setNicError] = useState("");
  const [contactError, setContactError] = useState("");

  useEffect(() => {
    setForm({ ...customer });
  }, [customer]);

  if (!customer) return null;

  // --- VALIDATION FUNCTIONS ---
  const validateNIC = (nic) => {
    const oldNIC = /^[0-9]{9}[vVxX]$/;
    const newNIC = /^[0-9]{12}$/;
    return oldNIC.test(nic) || newNIC.test(nic);
  };

  const validateContact = (number) => {
    const contact = /^0[0-9]{9}$/; // must start with 0 and be 10 digits
    return contact.test(number);
  };

  // --- HANDLE INPUT ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    // NIC validation
    if (name === "nic") {
      setForm({ ...form, nic: value });

      if (value === "" || validateNIC(value)) {
        setNicError("");
      } else {
        setNicError("Invalid NIC format (9 digits + V or 12 digits)");
      }
      return;
    }

    // Phone validation
    if (name === "phone_number") {
      setForm({ ...form, phone_number: value });

      if (value === "" || validateContact(value)) {
        setContactError("");
      } else {
        setContactError("Phone number must be 10 digits and start with 0");
      }
      return;
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

  // --- SAVE ---
  const handleSave = async () => {
    setLoading(true);
    setError(null);

    // Final validation check
    if (!validateNIC(form.nic)) {
      setError("Invalid NIC format.");
      setLoading(false);
      return;
    }

    if (!validateContact(form.phone_number)) {
      setError("Invalid phone number format");
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        name: form.name,
        nic: form.nic,
        phone_number: form.phone_number,
        email: form.email,
        nic_photo_front: form.nic_photo_front,
        nic_photo_back: form.nic_photo_back,
      };

      const response = await api.put(
        `/api/customers/${customer.customer_id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onSuccess(response.data.data);
      setSuccessMsg("Customer updated successfully!");

      setTimeout(() => {
        setSuccessMsg("");
        onCancel();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update customer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white-100">
      <div className="bg-white p-1 rounded-lg w-full h-full max-w-md">

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded border mb-3">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-100 text-green-700 p-2 rounded border mb-3">
            {successMsg}
          </div>
        )}

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

          {/* Name */}
          <label className="block mb-1 text-gray-600">Customer Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Full Name"
          />

          {/* NIC */}
          <label className="block mb-1 text-gray-600">Customer NIC:</label>
          <input
            type="text"
            name="nic"
            value={form.nic}
            onChange={handleChange}
            className={`w-full p-2 rounded-lg border ${
              nicError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="NIC Number"
          />
          {nicError && <p className="text-red-500 text-sm">{nicError}</p>}

          {/* Phone */}
          <label className="block mb-1 text-gray-600">Phone Number:</label>
          <input
            type="text"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            className={`w-full p-2 rounded-lg border ${
              contactError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="07XXXXXXXX"
          />
          {contactError && (
            <p className="text-red-500 text-sm">{contactError}</p>
          )}

          {/* Email */}
          <label className="block mb-1 text-gray-600">Customer Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Email Address"
          />

          {/* NIC Front */}
          <div>
            <label className="block mb-1 text-gray-600">NIC Photo (Front)</label>
            {form.nic_photo_front && (
              <img
                src={form.nic_photo_front}
                alt="NIC Front"
                className="w-full h-32 object-cover rounded border mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "nic_photo_front")}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* NIC Back */}
          <div>
            <label className="block mb-1 text-gray-600">NIC Photo (Back)</label>
            {form.nic_photo_back && (
              <img
                src={form.nic_photo_back}
                alt="NIC Back"
                className="w-full h-32 object-cover rounded border mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "nic_photo_back")}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Save (ConfirmWrapper) */}
          <ConfirmWrapper
            onConfirm={handleSave}
            message="Are you sure you want to update this customer?"
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

          {/* Cancel */}
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
