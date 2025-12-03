import { useEffect, useState } from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import api from "../../utils/axiosInstance";
import EditOwnerForm from "./EditOwnerForm";

export default function OwnerDetails({ owner, onClose, onDelete, onUpdated }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...owner });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setForm({ ...owner });
    setEditMode(false);
    setError(null);
    setSuccessMsg("");
  }, [owner]);

  if (!owner) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
    if (!isConfirmed) return;
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

      onUpdated(response.data.data); // update parent
      setEditMode(false);
      setIsConfirmed(false);
      setSuccessMsg("Owner updated successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update owner.");
      setIsConfirmed(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/owners/${owner.owner_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onDelete(owner.owner_id); // update parent
      setSuccessMsg("Owner deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete owner.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSave = () => {
    setIsConfirmed(true);
    handleSave();
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-100 bg-gray-100">
      <div className="bg-white p-11 rounded-lg shadow-lg w-full h-full max-w-md overflow-auto max-h-full relative">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {editMode ? "" : "Vehicle Owner Details"}
        </h2><br></br>

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
            <p><strong>Name:</strong> {owner.owner_name}</p>
            <p><strong>Contact Number:</strong> {owner.contact_number}</p><br></br>

            <button
              onClick={() => setEditMode(true)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-gray-900 transition"
            >
              Edit Owner
            </button>

            <ConfirmWrapper
              onConfirm={handleDelete}
              onCancel={() => {}}
              message="Are you sure you want to delete this Owner?"
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
                Delete Owner
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
          <EditOwnerForm
            owner={owner}
            onUpdated={(updatedOwner) => {
              onUpdated(updatedOwner);
              setEditMode(false);
            }}
            onCancel={() => setEditMode(false)}
          />
        )}
      </div>
    </div>
  );
}
