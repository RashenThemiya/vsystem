import { useEffect, useState } from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import api from "../../utils/axiosInstance";
import EditCustomerForm from "./EditCustomerForm";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";


export default function CustomerDetails({ customer, onClose, onDelete, onUpdated }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...customer });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setForm({ ...customer });
    setEditMode(false);
    setError(null);
    setSuccessMsg("");
  }, [customer]);

  if (!customer) return null;

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

    // 1. Send updated customer back to parent
    onUpdated(response.data.data);

    // 2. Close the customer detail panel immediately
    onClose();

  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Failed to update customer.");
  } finally {
    setLoading(false);
    setIsConfirmed(false);
  }
};


  // Delete customer
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/customers/${customer.customer_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      onDelete(customer.customer_id); // update parent
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete customer.");
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

  {/* Close Button (Left) */}
  <button
    onClick={onClose}
    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 shadow"
    title="Close"
  >
    <FaTimes size={16} />
  </button>

  {/* Edit Button */}
  {!editMode && (
    <button
      onClick={() => setEditMode(true)}
      className="p-2 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-700 shadow"
      title="Edit Customer"
    >
      <FaEdit size={16} />
    </button>
  )}
</div>
{/* Delete Button (Right Top Corner) */}
<div className="absolute top-3 right-3 z-10">

  <ConfirmWrapper
    onConfirm={handleDelete}
    message="Are you sure you want to delete this customer?"
    confirmText="Yes, Delete"
    cancelText="Cancel"
    icon={<FaTrash />}
    buttonBackgroundColor="bg-red-600"
    buttonTextColor="text-white"
  >
    <button
      type="button"
      className="p-2 rounded-full bg-red-200 hover:bg-red-300 text-red-700 shadow"
      title="Delete Customer"
      disabled={loading}
    >
      <FaTrash size={16} />
    </button>
  </ConfirmWrapper>

</div>
          {/* Title */}
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Customer Profile
          </h2>


          {/* Avatar / Name */}
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-gray-100 shadow  flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => navigate(`/customer-profile/${customer.customer_id}`)}
            >
              {customer.profile_photo ? (
                <img
                  src={customer.profile_photo}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-gray-700">
                  {customer.profile_photo?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>


            <h3
              className="text-xl font-semibold text-black mt-3 cursor-pointer"
              onClick={() => navigate(`/customer-profile/${customer.customer_id}`)}
            >
              {customer.name}
            </h3>

            <p className="text-sm text-gray-500">Customer ID: #{customer.customer_id}</p>
          </div>

          {/* Details Section */}
          <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Details</h4>

            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <p><strong>Email:</strong> <br /> {customer.email || "-"}</p><br></br>
              <p><strong>Phone:</strong> <br /> {customer.phone_number || "-"}</p>
              <p><strong>NIC:</strong> <br /> {customer.nic || "-"}</p>
            </div>
          </div>

          {/* NIC Images */}
          <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">NIC Images</h4>

            <div className="flex flex-col gap-3">
              {customer.nic_photo_front && (
                <img
                  src={customer.nic_photo_front}
                  className="w-full h-32 object-cover rounded-lg shadow border"
                  alt="NIC Front"
                />
              )}

              {customer.nic_photo_back && (
                <img
                  src={customer.nic_photo_back}
                  className="w-full h-32 object-cover rounded-lg shadow border"
                  alt="NIC Back"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------ EDIT MODE ------------ */}
      {editMode && (
        <EditCustomerForm
          customer={customer}
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
