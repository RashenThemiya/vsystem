import { useState, useEffect } from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import api from "../../utils/axiosInstance";
import { FaTimes, FaCheck } from "react-icons/fa";

export default function EditCustomerForm({ customer, onCancel, onSuccess }) {
  const [form, setForm] = useState({ ...customer });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const [nicError, setNicError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    setForm({ ...customer });
  }, [customer]);

  // Validation
  const validateNIC = (nic) =>
    /^[0-9]{9}[vVxX]$/.test(nic) || /^[0-9]{12}$/.test(nic);

  const validatePhone = (num) => /^0[0-9]{9}$/.test(num);

  // Input Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nic") {
      setNicError(!validateNIC(value) ? "Invalid NIC format." : "");
    }

    if (name === "phone_number") {
      setPhoneError(!validatePhone(value) ? "Phone must start with 0 and contain 10 digits." : "");
    }

    setForm({ ...form, [name]: value });
  };

  // File Change Handler
  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, [key]: reader.result });
    reader.readAsDataURL(file);
  };

  // Save Handler
  const handleSave = async () => {
    if (phoneError) {
      setError("Please fix validation errors before saving.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData = {
        name: form.name,
        nic: form.nic,
        phone_number: form.phone_number,
        email: form.email,
        nic_photo_front: form.nic_photo_front,
        nic_photo_back: form.nic_photo_back,
        profile_photo: form.profile_photo,
      };

      const response = await api.put(
        `/api/customers/${customer.customer_id}`,
        updateData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setSuccessMsg("Customer updated successfully!");
      onSuccess(response.data.data);

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

    if (loading) return <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-3">
      <div className="animate-spin h-8 w-8 rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      <p className="text-sm font-semibold text-gray-700">
        Updating customer...
      </p>
    </div>
  </div>;

  if (!customer) return null;

  return (
    <div className="bg-white p-3 w-full max-w-md overflow-auto relative">

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
          message="Are you sure you want to update this customer?"
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded text-center mb-4 mt-12">
          ❌ {error}
        </div>
      )}

      {/* Success Message */}
      {successMsg && (
        <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-2 rounded text-center mb-4 mt-12">
          ✅ {successMsg}
        </div>
      )}

      {/* Title */}
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Edit Customer
      </h2>

      {/* Form */}
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>

        {/* Full Name */}
        <div>
          <label className="block text-gray-600 font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Customer Name"
          />
        </div>

        {/* NIC */}
        <div>
          <label className="block text-gray-600 font-medium">NIC/ID</label>
          <input
            type="text"
            name="nic"
            value={form.nic}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="NIC Number"
          />
          
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-600 font-medium">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="07XXXXXXXX"
          />
          {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-600 font-medium">Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Email"
          />
        </div>

        {/* NIC Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* NIC Front */}
  <div>
    <label className="block text-gray-600 font-medium mb-1">
      Profile Photo
    </label>

    {form.profile_photo && (
      <img
        src={form.profile_photo}
        className="w-full h-32 object-cover rounded-lg border mb-2"
        alt="NIC Front"
      />
    )}

    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleFileChange(e, "profile_photo")}
      className="w-full p-2 border border-gray-300 rounded-lg"
    />
  </div>

  {/* NIC Front */}
  <div>
    <label className="block text-gray-600 font-medium mb-1">
      NIC Photo (Front)
    </label>

    {form.nic_photo_front && (
      <img
        src={form.nic_photo_front}
        className="w-full h-32 object-cover rounded-lg border mb-2"
        alt="NIC Front"
      />
    )}

    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleFileChange(e, "nic_photo_front")}
      className="w-full p-2 border border-gray-300 rounded-lg"
    />
  </div>

  {/* NIC Back */}
  <div>
    <label className="block text-gray-600 font-medium mb-1">
      NIC Photo (Back)
    </label>

    {form.nic_photo_back && (
      <img
        src={form.nic_photo_back}
        className="w-full h-32 object-cover rounded-lg border mb-2"
        alt="NIC Back"
      />
    )}

    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleFileChange(e, "nic_photo_back")}
      className="w-full p-2 border border-gray-300 rounded-lg"
    />
  </div>
</div>


      </form>
    </div>
  );
}
