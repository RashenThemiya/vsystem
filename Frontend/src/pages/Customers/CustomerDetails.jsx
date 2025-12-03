import { useEffect, useState } from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import api from "../../utils/axiosInstance";
import EditCustomerForm from "./EditCustomerForm";

export default function CustomerDetails({ customer, onClose, onDelete, onUpdated }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...customer });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

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
    <div className="flex justify-center items-center w-100 min-h-screen bg-white-100">
      <div className="bg-white p-15 rounded-lg shadow-lg w-full h-full max-w-md overflow-auto max-h-full relative">
        <h2 className="text-xl font-semibold mb-6 text-center text-grey-100">
          {editMode ? "Edit Customer" : "Customer Details"}
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
            <p><strong>Name:</strong> {customer.name}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Phone:</strong> {customer.phone_number}</p>
            <p><strong>NIC:</strong> {customer.nic}</p>

            <div>
              <h3 className="font-semibold mb-2">NIC Images</h3>
              {customer.nic_photo_front && (
                <img
                  src={customer.nic_photo_front}
                  className="w-full h-32 object-cover rounded border mb-2"
                  alt="NIC Front"
                />
              )}
              {customer.nic_photo_back && (
                <img
                  src={customer.nic_photo_back}
                  className="w-full h-32 object-cover rounded border"
                  alt="NIC Back"
                />
              )}
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Edit Customer
            </button>

            <ConfirmWrapper
              onConfirm={handleDelete}
              onCancel={() => {}}
              message="Are you sure you want to delete this customer?"
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
                Delete Customer
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
          <EditCustomerForm
            customer={customer}
            onCancel={() => setEditMode(false)}
            onSuccess={(updatedCustomer) => {
              onUpdated(updatedCustomer); // update table
              setEditMode(false);          // close edit form
                                // close details
            }}
          />
        )}



      </div>
    </div>
  );
}
