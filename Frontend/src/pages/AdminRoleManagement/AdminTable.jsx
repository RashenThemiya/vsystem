// AdminRoleTable.jsx
import React from "react";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function AdminRoleTable({ admins = [], loading, error, onSelectAdmin, onDeleteAdmin }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading admin roles...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : admins.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No admin roles found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="text-left text-sm text-gray-600 border-b">
              <tr>
                <th className="py-3 px-4">Admin ID</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {admins.map((a) => (
                <tr
                  key={a.id}
                  className="hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => onSelectAdmin && onSelectAdmin(a)}
                >
                  <td className="py-4 px-4 flex items-center gap-3">
                    <Avatar name={a.role} />
                    <div>
                      <div className="font-medium">{a.email.split("@")[0]}</div>
                      <div className="text-xs text-gray-400">{a.admin_id}</div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-sm text-gray-600">{a.email}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{a.role}</td>
                  <td className="py-4 px-4">
                    <ConfirmWrapper
                      onConfirm={() => onDeleteAdmin(a)}
                      onCancel={() => {}}
                      message="Are you sure you want to delete this vehicle?"
                      confirmText="Yes, Delete"
                      cancelText="Cancel"
                      icon={<FiTrash2 />}
                      buttonBackgroundColor="bg-red-600"
                      buttonTextColor="text-white"
                    >
                      <button
                        type="button"
                        className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800 transition"
                        disabled={loading}
                      >
                        Delete 
                      </button>
                    </ConfirmWrapper>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Avatar component
function Avatar({ name }) {
  const initials = (name || "A")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
      {initials}
    </div>
  );
}
