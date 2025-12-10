import { useState } from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { FaTimes, FaEdit, FaTrash, FaUser } from "react-icons/fa";
import EditOwnerForm from "./EditOwnerForm";
import api from "../../utils/axiosInstance";

export default function OwnerDetails({ owner, onClose, onDelete, onUpdated }) {
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  if (!owner) return null;

  const handleDelete = async () => {
    try {
      await api.delete(`/api/owners/${owner.owner_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      onDelete(owner.owner_id);
      setSuccessMsg("Owner deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete owner.");
    }
  };

  return (
    <div className="flex justify-center items-center w-100 min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-100 overflow-auto h-full relative">

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-800 border border-red-300 px-4 py-2 rounded text-center mb-4">
            ❌ {error}
          </div>
        )}

        {/* SUCCESS */}
        {successMsg && (
          <div className="bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded text-center mb-4">
            ✅ {successMsg}
          </div>
        )}

        {/* TOP ACTION BAR */}
        {!editMode && (
          <>
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 left-3 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 shadow"
              title="Close"
            >
              <FaTimes size={16} />
            </button>

            {/* Edit */}
            <button
              onClick={() => setEditMode(true)}
              className="absolute top-3 left-14 p-2 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-700 shadow"
              title="Edit Owner"
            >
              <FaEdit size={16} />
            </button>

            {/* Delete */}
            <div className="absolute top-3 right-3">
              <ConfirmWrapper
                onConfirm={handleDelete}
                message="Are you sure you want to delete this Owner?"
                confirmText="Yes, Delete"
                cancelText="Cancel"
              >
                <button className="p-2 rounded-full bg-red-200 hover:bg-red-300 text-red-700 shadow">
                  <FaTrash size={16} />
                </button>
              </ConfirmWrapper>
            </div>
          </>
        )}

        {/* TITLE */}
        {!editMode && (
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 mt-5">
            Owner Profile
          </h2>
        )}

        {/* -------- VIEW MODE -------- */}
        {!editMode && (
          <div className="space-y-6">

            {/* Avatar */}
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full bg-gray-100 shadow flex items-center justify-center overflow-hidden">
                <FaUser className="text-4xl text-gray-600" />
              </div>

              <h3 className="text-xl font-semibold text-black mt-3">
                {owner.owner_name}
              </h3>

              <p className="text-sm text-gray-500">
                Owner ID: #{owner.owner_id}
              </p>
            </div>

            {/* DETAILS */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Details</h4>

              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <p><strong>Contact:</strong><br /> {owner.contact_number}</p>
                
              </div>
            </div>

            {/* You can add NIC or license images here if needed */}
            {owner.nic_photo_front || owner.nic_photo_back ? (
              <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  NIC Images
                </h4>

                <div className="flex flex-col gap-3">
                  {owner.nic_photo_front && (
                    <img
                      src={owner.nic_photo_front}
                      className="w-full h-32 object-cover rounded-lg shadow border"
                      alt="NIC Front"
                    />
                  )}

                  {owner.nic_photo_back && (
                    <img
                      src={owner.nic_photo_back}
                      className="w-full h-32 object-cover rounded-lg shadow border"
                      alt="NIC Back"
                    />
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* -------- EDIT MODE -------- */}
        {editMode && (
          <EditOwnerForm
            owner={owner}
            onCancel={() => setEditMode(false)}
            onUpdated={(updated) => {
              onUpdated(updated);
              setEditMode(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
