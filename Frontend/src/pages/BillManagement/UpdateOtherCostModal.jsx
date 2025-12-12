import { useState, useEffect } from "react";
import { FaMoneyBill, FaTimes } from "react-icons/fa";
import axios from "axios";

const UpdateOtherCostModal = ({ bill, onClose, onSuccess }) => {
  // Must match Prisma VehicleCostType enum
  const costTypes = [
    "Lease_Cost",
    "Service_Cost",
    "Repairs_Cost",
    "Insurance_Amount",
    "Revenue_License",
    "Eco_Test_Cost",
    "Fuel_Cost",
  ];

  const [cost, setCost] = useState("");
  const [costType, setCostType] = useState(bill.bill_type || "Lease_Cost");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [zoomImage, setZoomImage] = useState(false);


  // Update costType if bill changes
  useEffect(() => {
    setCostType(bill.bill_type || "Lease_Cost");
  }, [bill]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      // Send bill_id so backend can mark it completed
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/vehicle-other-costs`,
        {
          vehicle_id: bill.vehicle_id,
          date: bill.bill_date,
          cost: Number(cost),
          cost_type: costType,
          bill_id: bill.bill_id, // important to update bill status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      onSuccess(); // refresh parent
      onClose();   // close modal
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update cost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-100 min-h-screen bg-grey-100">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full h-full max-w-md mt-12 relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full shadow"
        >
          <FaTimes size={18} />
        </button>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 justify-center">
          <FaMoneyBill /> Update Other Cost
        </h2>

        {/* Bill Info */}
        <div className="mb-4 flex flex-col items-center">
          {bill.bill_image && (
            <img
              src={bill.bill_image} // dynamically use the backend URL
              alt="Bill"
              className="w-45 h-55 object-cover rounded-lg mb-5 border border-gray-300"
              onClick={() => setZoomImage(true)}
              onError={(e) => {
                e.target.src = "/placeholder.png"; // fallback if image not loaded
              }}
            />
          )}
          <div className=" space-y-2 items-center">
          {[
            ["Bill Type", bill.bill_type.replace("_", " ")],
            ["Bill Date", new Date(bill.bill_date).toLocaleDateString()],
            ["Status", bill.bill_status],
            ["Vehicle", `${bill.vehicle_name} (ID: ${bill.vehicle_id})`],
            ["Driver", `${bill.driver_name} (ID: ${bill.driver_id})`],
          ].map(([label, value]) => (
            <div key={label} className="grid grid-cols-3 gap-2">
              <span className="font-semibold">{label}:</span>
              <span className="col-span-2 text-right">{value}</span>
            </div>
          ))}
        </div>
          
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Cost</label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="input w-full border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>

          <div>
            <label className="label">Cost Type</label>
            <select
              value={costType}
              onChange={(e) => setCostType(e.target.value)}
              className="input w-full border border-gray-300 rounded px-2 py-1"
            >
              {costTypes.map((c) => (
                <option key={c} value={c}>
                  {c.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-2 rounded hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Cost"}
          </button>

        </form>
      </div>
      {zoomImage && (
  <div
    className="fixed inset-0 bg-white/40 backdrop-blur-sm flex justify-center items-center z-50"
    onClick={() => setZoomImage(false)}
  >
    <img
      src={bill.bill_image}
      className="max-w-4xl max-h-[90vh] rounded-xl shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
)}

    </div>
  );
};

export default UpdateOtherCostModal;
