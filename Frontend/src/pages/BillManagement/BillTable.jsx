export default function BillTable({ bills, onSelect, onUpdateCost, searchQuery = "", statusFilter = "", onSelectDriver, onSelectVehicle}) {
  const filteredBills = bills.filter((b) => {
    const q = searchQuery.toLowerCase();

    // Filter by search
    const matchesSearch =
      (b.bill_type || "").toLowerCase().includes(q) ||
      (b.vehicle_id?.toString() || "").includes(q) ||
      (b.driver_id?.toString() || "").includes(q);

    // Filter by status card
    let matchesStatus = true;
    if (statusFilter === "pending") matchesStatus = b.bill_status === "pending";
    else if (statusFilter === "completed") matchesStatus = b.bill_status === "completed";
    else if (statusFilter === "newThisMonth") {
      const billDate = new Date(b.bill_date);
      const now = new Date();
      matchesStatus =
        billDate.getMonth() === now.getMonth() && billDate.getFullYear() === now.getFullYear();
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-gray-600">
            <th className="p-2 text-left">Bill ID</th>
            <th className="p-2 text-left" >Vehicle ID</th>
            <th className="p-2 text-left" >Driver ID</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredBills.map((bill) => (
            <tr
              key={bill.bill_id}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect && onSelect(bill)}
            >
              <td className="p-2">{bill.bill_id}</td>
              <td className="px-4 py-4 text-blue-600 hover:underline cursor-pointer" onClick={() => onSelectVehicle(bill)}>{bill.vehicle_id}</td>
              <td className="px-4 py-4 text-blue-600 hover:underline cursor-pointer" onClick={() => onSelectDriver(bill)}>{bill.driver_id}</td>
              <td className="p-2 capitalize">{bill.bill_type}</td>
              <td className="p-2">{new Date(bill.bill_date).toLocaleDateString()}</td>
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
                    onClick={(e) => {
                      e.stopPropagation(); // prevent row click
                      onUpdateCost(bill);
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-2 py-1 rounded cursor-pointer hover:bg-indigo-900 text-xs font-semibold"
                  >
                    Update Other Cost
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
