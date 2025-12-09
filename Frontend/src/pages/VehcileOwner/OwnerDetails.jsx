import { useEffect, useState } from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-5 rounded-lg shadow-lg w-100 h-full relative overflow-auto">
      
        {/* TOP LEFT — Close */}
        {!editMode &&(
              <button
          onClick={onClose}
          className="absolute top-3 left-1 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 shadow"
        >
          <FaTimes size={16} />
        </button>
        )}
        {/* TOP left — Edit */}
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="absolute top-3 left-15 p-2 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-700 shadow"
          >
            <FaEdit size={16} />
          </button>
        )}
        {/* Delete Button */}
        {!editMode && (
            <ConfirmWrapper
              onConfirm={handleDelete}
              message="Are you sure you want to delete this Owner?"
              confirmText="Yes, Delete"
              cancelText="Cancel"
              icon={<FaTrash />}
              buttonBackgroundColor="bg-red-600"
              buttonTextColor="text-white"
            >
              <button
                type="button"
                className="absolute top-3 right-3 p-2 rounded-full bg-red-200 hover:bg-red-300 text-red-700 shadow"
              >
                <FaTrash size={16}/>
              </button>
            </ConfirmWrapper>
        )}
            

        {/* Messages */}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded text-center mb-4 mt-8">
            ❌ {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-2 rounded text-center mb-4 mt-8">
            ✅ {successMsg}
          </div>
        )}

        {/* TITLE */}
        {!editMode && (
          
          <h2 className="text-2xl font-bold text-center text-gray-800 mt-10 mb-6">
            Owner Details
          </h2>
        )}

        {/* VIEW MODE */}
        {!editMode && (
          <div className="space-y-4 text-gray-700">

            <p><strong>Name:</strong> {owner.owner_name}</p>
            <p><strong>Contact Number:</strong> {owner.contact_number}</p>

            
          </div>
        )}

        {/* EDIT MODE */}
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
