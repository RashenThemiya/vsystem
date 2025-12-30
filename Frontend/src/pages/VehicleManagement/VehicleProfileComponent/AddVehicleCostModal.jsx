import { useState } from "react";
import api from "../../../utils/axiosInstance";
import dayjs from "dayjs";

const VEHICLE_OTHER_COST_TYPES = {
  Lease_Cost: "Lease_Cost",
  Service_Cost: "Service_Cost",
  Repairs_Cost: "Repairs_Cost",
  Insurance_Amount: "Insurance_Amount",
  Revenue_License: "Revenue_License",
  Eco_Test_Cost: "Eco_Test_Cost",
  Fuel_Cost: "Fuel_Cost",
};

const AddVehicleCostModal = ({ vehicleId, isOpen, onClose, onSuccess }) => {
  const [costType, setCostType] = useState("");
  const [cost, setCost] = useState("");
  const [serviceMeter, setServiceMeter] = useState("");
  const [insuranceExpiry, setInsuranceExpiry] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [ecoExpiry, setEcoExpiry] = useState("");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
      vehicle_id: Number(vehicleId),
      date: new Date(date).toISOString(),// ensures valid ISO-8601
      cost: Number(cost),
      cost_type: costType,
      remarks: remarks || null,

    };

      // Conditional fields
      if (costType === "Service_Cost") payload.service_meter_number = Number(serviceMeter);
      if (costType === "Insurance_Amount") payload.insurance_expiry_date = insuranceExpiry ? dayjs(insuranceExpiry).toISOString() : null;
      if (costType === "Revenue_License") payload.license_expiry_date = licenseExpiry ? dayjs(licenseExpiry).toISOString() : null;
      if (costType === "Eco_Test_Cost") payload.eco_test_expiry_date = ecoExpiry ? dayjs(ecoExpiry).toISOString() : null;

      await api.post("/api/vehicle-other-costs", payload);

      onSuccess();
      onClose();
    } catch (err) {
      console.error("ERR ADDING COST:", err.response?.data || err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/40 backdrop-blur-md flex justify-center items-center h-full overflow-auto z-50">
      <div className="bg-white w-96 p-6 rounded-xl shadow-xl relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">Add Vehicle Other Cost</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Cost Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Cost Type</label>
            <select
              value={costType}
              onChange={(e) => setCostType(e.target.value)}
              className="border px-2 py-2 rounded w-full"
              required
            >
              <option value="">Select cost type</option>
              {Object.values(VEHICLE_OTHER_COST_TYPES).map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Cost Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">Cost Amount</label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="border px-2 py-2 rounded w-full"
              required
            />
          </div>

          {/* Conditional Fields */}
          {costType === "Service_Cost" && (
            <div>
              <label className="block text-sm font-medium mb-1">Service Meter Number</label>
              <input
                type="number"
                value={serviceMeter}
                onChange={(e) => setServiceMeter(e.target.value)}
                className="border px-2 py-2 rounded w-full"
                required
              />
            </div>
          )}

          {costType === "Insurance_Amount" && (
            <div>
              <label className="block text-sm font-medium mb-1">Insurance Expiry Date</label>
              <input
                type="date"
                value={insuranceExpiry}
                onChange={(e) => setInsuranceExpiry(e.target.value)}
                className="border px-2 py-2 rounded w-full"
                required
              />
            </div>
          )}

          {costType === "Revenue_License" && (
            <div>
              <label className="block text-sm font-medium mb-1">License Expiry Date</label>
              <input
                type="date"
                value={licenseExpiry}
                onChange={(e) => setLicenseExpiry(e.target.value)}
                className="border px-2 py-2 rounded w-full"
                required
              />
            </div>
          )}

          {costType === "Eco_Test_Cost" && (
            <div>
              <label className="block text-sm font-medium mb-1">Eco Test Expiry Date</label>
              <input
                type="date"
                value={ecoExpiry}
                onChange={(e) => setEcoExpiry(e.target.value)}
                className="border px-2 py-2 rounded w-full"
                required
              />
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border px-2 py-2 rounded w-full"
              required
            />
          </div>

          {/* remark */}
          <div>
            <label className="block text-sm font-medium mb-1">Remark</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="border px-2 py-2 rounded w-full"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition w-full"
          >
            {loading ? "Adding..." : "Add Cost"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleCostModal;
