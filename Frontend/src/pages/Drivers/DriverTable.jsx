// DriverTable.jsx
import React from "react";

export default function DriverTable({ drivers = [], loading, error, onSelectDriver }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading drivers...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : drivers.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No drivers found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="text-left text-sm text-gray-600 border-b">
              <tr>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Driver Charges</th>
                <th className="py-3 px-4">NIC</th>
                <th className="py-3 px-4">Age</th>
                <th className="py-3 px-4">License No</th>
                <th className="py-3 px-4">License Expiry</th>
              </tr>
            </thead>

            <tbody>
              {drivers.map((d) => (
                <tr
                  key={d.driver_id}
                  className="hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => onSelectDriver(d)}
                >
                  <td className="py-4 px-4 flex items-center gap-3">
                    <Avatar name={d.name} src={d.avatar_url} />
                    <div>
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-gray-400">{d.driver_id}</div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-sm text-gray-600">{d.phone_number}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{d.driver_charges}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{d.nic}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{d.age}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{d.license_number}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                  {d.license_expiry_date ? new Date(d.license_expiry_date).toISOString().split("T")[0] : "N/A"}
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
