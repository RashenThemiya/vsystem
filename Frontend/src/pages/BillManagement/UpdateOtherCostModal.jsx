import { useState, useEffect } from "react";
import { FaMoneyBill } from "react-icons/fa";
import axios from "axios";

const UpdateOtherCostModal = ({ bill, onClose, onSuccess }) => {
  const costTypes = ["Lease_Cost", "Repair_Cost", "Fuel_Cost", "Other_Cost"];

  // Map bill type to default cost type
  const mapBillToCostType = (billType) => {
    switch (billType) {
      case "Service_Cost":
        return "Repair_Cost";
      case "Repair_Cost":
        return "Repair_Cost";
      case "Fuel_Bill":
        return "Fuel_Cost";
      case "Other_Cost":
      case "Insurance":
      case "License":
        return "Other_Cost";
      default:
        return "Lease_Cost";
    }
  };

  const [cost, setCost] = useState("");
  const [costType, setCostType] = useState(mapBillToCostType(bill.bill_type));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [driver, setDriver] = useState(null);

  // Update costType if bill changes
  useEffect(() => {
    setCostType(mapBillToCostType(bill.bill_type));
  }, [bill]);

  // Fetch vehicle & driver info
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const [vehicleRes, driverRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles/${bill.vehicle_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/drivers/${bill.driver_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setVehicle(vehicleRes.data.data);
        setDriver(driverRes.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load vehicle/driver info.");
      }
    };

    if (bill) fetchInfo();
  }, [bill]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/vehicle-other-costs`,
        {
          vehicle_id: bill.vehicle_id,
          date: bill.bill_date,
          cost: Number(cost),
          cost_type: costType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update cost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-start z-50 overflow-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mt-12">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaMoneyBill /> Update Other Cost
        </h2>

        {/* Bill Info */}
        <div className="mb-4">
          {bill.bill_image && (
            <img
              src={bill.bill_image}
              alt="Bill"
              className="w-full h-40 object-cover rounded mb-2"
            />
          )}
          <p>Bill Type: {bill.bill_type.replace("_", " ")}</p>
          <p>Bill Date: {new Date(bill.bill_date).toLocaleDateString()}</p>
          <p>Status: {bill.bill_status}</p>
          <p>
            Vehicle: {vehicle ? `${vehicle.vehicle_number} - ${vehicle.name}` : bill.vehicle_id}
          </p>
          <p>Driver: {driver ? `${driver.name} (${driver.nic})` : bill.driver_id}</p>
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
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Cost Type</label>
            <select
              value={costType}
              onChange={(e) => setCostType(e.target.value)}
              className="input"
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
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Cost"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateOtherCostModal;
