export default function BillTable({ bills, onSelect, onUpdateCost }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-gray-600">
            <th className="p-2 text-left">Bill ID</th>
            <th className="p-2 text-left">Vehicle ID</th>
            <th className="p-2 text-left">Driver ID</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {bills.map((bill) => (
            <tr
              key={bill.bill_id}
              className="hover:bg-gray-100 cursor-pointer"
            >
              <td className="p-2">{bill.bill_id}</td>
              <td className="p-2">{bill.vehicle_id}</td>
              <td className="p-2">{bill.driver_id}</td>
              <td className="p-2 capitalize">{bill.bill_type}</td>
              <td className="p-2">
                {new Date(bill.bill_date).toLocaleDateString()}
              </td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    bill.bill_status === "pending"
                      ? "bg-yellow-200 text-yellow-700"
                      : "bg-green-200 text-green-700"
                  }`}
                >
                  {bill.bill_status}
                </span>
              </td>
              <td className="p-2">
                {bill.bill_status === "pending" && (
                  <button
                    onClick={() => onUpdateCost(bill)}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-2 py-1 rounded hover:bg-indigo-700 text-xs"
                  >
                    <p className="mb-1">Update Other Cost</p>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
