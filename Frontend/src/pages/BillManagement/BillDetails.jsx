import { Pencil, Trash2, X } from "lucide-react";

export default function BillDetails({ bill, onClose, onEdit, onDelete }) {
  if (!bill) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 relative">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-black"
        onClick={onClose}
      >
        <X size={18} />
      </button>

      <h2 className="text-xl font-bold mb-4">Bill Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Bill ID:</strong> {bill.bill_id}</p>
          <p><strong>Vehicle ID:</strong> {bill.vehicle_id}</p>
          <p><strong>Driver ID:</strong> {bill.driver_id}</p>
          <p><strong>Bill Type:</strong> {bill.bill_type}</p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(bill.bill_date).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded text-xs ${
                bill.bill_status === "Pending"
                  ? "bg-yellow-200 text-yellow-700"
                  : "bg-green-200 text-green-700"
              }`}
            >
              {bill.bill_status}
            </span>
          </p>
        </div>

        <div className="flex justify-center">
          {bill.bill_image ? (
            <img
              src={bill.bill_image}
              alt="Bill"
              className="w-40 h-40 object-cover rounded shadow-md"
            />
          ) : (
            <div className="w-40 h-40 bg-gray-200 rounded flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => onEdit(bill)}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Pencil size={16} /> Edit
        </button>

        <button
          onClick={() => onDelete(bill.bill_id)}
          className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}
