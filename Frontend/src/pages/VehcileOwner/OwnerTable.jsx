// OwnerTable.jsx
import React from "react";

export default function OwnerTable({ owners = [], loading, error, onSelectOwner }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading owners...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : owners.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No Vehicle owners found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="text-left text-sm text-gray-600 border-b">
              <tr>
                <th className="py-3 px-4">Vehicle Owner</th>
                <th className="py-3 px-4">Phone Number</th>
              </tr>
            </thead>

            <tbody>
              {owners.map((o) => (
                <tr
                  key={o.owner_id}
                  className="hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => onSelectOwner(o)}
                >
                  <td className="py-4 px-4 flex items-center gap-3">
                    <Avatar name={o.owner_name} src={o.avatar_url} />
                    <div>
                      <div className="font-medium">{o.owner_name}</div>
                      <div className="text-xs text-gray-400">{o.owner_id}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{o.contact_number}</td>
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
function Avatar({ name, src }) {
  if (src) {
    return <img src={src} alt={name} className="w-10 h-10 rounded-full object-cover" />;
  }

  const initials = (name || "U")
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
