// VehicleTable.jsx
import React from "react";

export default function VehicleTable({ vehicles = [], loading, error, onSelectVehicle }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading vehicles...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No vehicles found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="text-left text-sm text-gray-600 border-b">
              <tr>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Number Plate</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">AC</th>
                <th className="py-3 px-4">Fuel</th>
                <th className="py-3 px-4">Rent (Rs)</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Mileage Costs</th>
          

               
              </tr>
            </thead>

            <tbody>
              {vehicles.map((v) => (
                <tr
                  key={v.vehicle_id}
                  className="hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => onSelectVehicle && onSelectVehicle(v)}
                >
                  <td className="py-4 px-4 flex items-center gap-3">
                    <Avatar name={v.name} src={v.avatar_url} />
                    <div>
                      <div className="font-medium">{v.name}</div>
                      <div className="text-xs text-gray-400">{v.vehicle_id}</div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-sm text-gray-600">
                    {v.vehicle_number || "—"}
                  </td>

                  <td className="py-4 px-4 text-sm text-gray-600">
                    {v.type || "—"}
                  </td>

                  <td className="py-4 px-4 text-sm text-gray-600">
                    {v.ac_type || "—"}
                  </td>

                  <td className="py-4 px-4 text-sm text-gray-600">
                    {v.fuel?.type || "—"}
                  </td>

                  <td className="py-4 px-4 text-sm text-gray-600">
                    {v.rent_cost_daily || "—"}
                  </td>

                  <td className="py-4 px-4 text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-white text-xs ${v.vehicle_availability === "Yes" ? "bg-green-500" : "bg-red-500"}`}>
                        {v.vehicle_availability}
                      </span>
                  </td>

                  <td className="py-4 px-4 text-sm text-gray-600">
                    {v.owner?.owner_name || "—"}
                  </td>

                  <td className="py-4 px-4 text-sm text-gray-600">
                    {v.owner?.contact_number || "—"}
                  </td>

                  <td className="py-4 px-4 text-sm text-gray-600">
                    {v.mileage_costs?.length > 0 ? (
                      <ul className="list-disc ml-4">
                        {v.mileage_costs.map((m) => (
                          <li key={m.mileage_cost_id}>
                            Base: {m.mileage_cost}, Additional: {m.mileage_cost_additional}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">No data</span>
                    )}
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

// Avatar component - same style as OwnerTable
function Avatar({ name, src }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
    );
  }

  const initials = (name || "V")
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
