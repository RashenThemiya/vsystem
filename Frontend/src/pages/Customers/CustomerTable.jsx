// CustomerTable.jsx
import React from "react";

export default function CustomerTable({ customers = [], loading, error, onSelectCustomer }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading customers...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : customers.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No customers found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="text-left text-sm text-gray-600 border-b">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">NIC No</th>
                
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.customer_id}
                  className="hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => onSelectCustomer(c)}
                >
                  <td className="py-4 px-4 flex items-center gap-3">
                    <Avatar name={c.name} src={c.avatar_url} />
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-gray-400">{c.customer_id}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{c.email}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{c.phone_number}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{c.nic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Avatar({ name, src }) {
  if (src) {
    return <img src={src} alt={name} className="w-10 h-10 rounded-full object-cover" />;
  }
  const initials = (name || "U").split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
      {initials}
    </div>
  );
}

function Badge({ label, type }) {
  const base = "px-3 py-1 rounded-full text-xs font-medium";
  if (type === "pro") return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pro</span>;
  return <span className={`${base} bg-gray-100 text-gray-700`}>{label}</span>;
}
