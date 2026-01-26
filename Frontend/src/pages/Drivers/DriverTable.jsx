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
        // Scroll container for the table body; keeps header visible when rows scroll
        <div className="overflow-x-auto">
          <div className="max-h-[420px] overflow-y-auto">
            <table className="min-w-full table-fixed">
              <thead className="bg-white border-b">
                <tr>
                  {/* set widths so columns align predictably */}
                  <th className="py-3 px-4 text-left text-sm text-gray-600 w-16 z-20 bg-white">No</th>
                  <th className="py-3 px-4 text-left text-sm text-gray-600 w-1/4 z-20 bg-white">Driver</th>
                  <th className="py-3 px-4 text-left text-sm text-gray-600 w-1/6 z-20 bg-white">Phone Number</th>
                  <th className="py-3 px-4 text-left text-sm text-gray-600 w-1/6 z-20 bg-white">Driver Charges</th>
                  <th className="py-3 px-4 text-left text-sm text-gray-600 w-1/8  z-20 bg-white">NIC</th>
                  <th className="py-3 px-4 text-left text-sm text-gray-600 w-1/12  z-20 bg-white">Age</th>
                  <th className="py-3 px-4 text-left text-sm text-gray-600 w-1/6  z-20 bg-white">License No</th>
                  <th className="py-3 px-4 text-left text-sm text-gray-600 w-1/6  z-20 bg-white">License Expiry</th>
                </tr>
              </thead>

              <tbody>
                {drivers.map((d, index) => (
                  <tr
                    key={d.driver_id}
                    className="hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => onSelectDriver && onSelectDriver(d)}
                  >
                    <td className="py-3 px-4 text-sm text-gray-600 align-top">
                      {index+1}
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-3">
                        <Avatar name={d.name} src={d.avatar_url || d.image} />
                        <div>
                          <div className="font-medium">{d.name}</div>
                          <div className="text-xs text-gray-400">ID: {d.driver_id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-sm text-gray-600 align-top">{d.phone_number || "-"}</td>
                    <td className="py-4 px-4 text-sm text-gray-600 align-top">{d.driver_charges ?? "-"}</td>
                    <td className="py-4 px-4 text-sm text-gray-600 align-top">{d.nic || "-"}</td>
                    <td className="py-4 px-4 text-sm text-gray-600 align-top">{d.age ?? "-"}</td>
                    <td className="py-4 px-4 text-sm text-gray-600 align-top">{d.license_number || "-"}</td>
                    <td className="py-4 px-4 text-sm text-gray-600 align-top">
                      {d.license_expiry_date ? new Date(d.license_expiry_date).toISOString().split("T")[0] : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
