import { useEffect, useState } from "react";
import { FaReceipt, FaUpload, FaTimes  } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmWrapper from "../../components/ConfirmWrapper";

const AddBillModal = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();

  const [bill, setBill] = useState({
    vehicle_id: "",
    driver_id: "",
    bill_type: "",
    bill_date: "",
    bill_status: "pending",
    bill_image_base64: "",
    vehicle_other_cost_id: null,
  });

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [preview, setPreview] = useState("");

  // Bill type mapping
  const billTypeMap = {
    Service_Cost: "Service_Cost",
    Repairs_Cost: "Repairs_Cost",
    Lease_Cost: "Lease_Cost",
    Insurance_Amount: "Insurance_Amount",
    Revenue_License: "Revenue_License",
    Eco_Test_Cost: "Eco_Test_Cost",
    Fuel_Cost: "Fuel_Cost",
  };

  const billTypes = Object.keys(billTypeMap);
  const billStatusOptions = ["pending", "completed"];

  // Fetch vehicles & drivers
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized! Please log in.");
      navigate("/login");
      return;
    }

    const fetchDropdowns = async () => {
      setDropdownLoading(true);
      try {
        const [vehicleRes, driverRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/drivers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Safe array handling
        const vehiclesArray = Array.isArray(vehicleRes.data?.data)
          ? vehicleRes.data.data
          : Array.isArray(vehicleRes.data)
          ? vehicleRes.data
          : [];
        const driversArray = Array.isArray(driverRes.data?.data)
          ? driverRes.data.data
          : Array.isArray(driverRes.data)
          ? driverRes.data
          : [];

        setVehicles(vehiclesArray);
        setDrivers(driversArray);
      } catch (err) {
        console.error("Dropdown fetch error:", err.response || err);
        setError("Failed to load vehicles or drivers.");
      } finally {
        setDropdownLoading(false);
      }
    };

    fetchDropdowns();
  }, [navigate]);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBill((prev) => ({ ...prev, [name]: value }));
  };

  // File upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setBill((prev) => ({
        ...prev,
        bill_image_base64: reader.result.split(",")[1],
      }));
    };
    reader.readAsDataURL(file);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmed) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const backendBillType = billTypeMap[bill.bill_type];
      if (!backendBillType) throw new Error("Invalid bill type selected.");

      const payload = {
        ...bill,
        vehicle_id: bill.vehicle_id || null,
        driver_id: bill.driver_id || null,
        bill_type: backendBillType,
        vehicle_other_cost_id: bill.vehicle_other_cost_id || null,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/bill-uploads`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Use returned bill object if exists
      const createdBill = res.data?.data || res.data;

      setShowSuccess(true);
      onSuccess(createdBill);

      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to upload bill.");
    } finally {
      setLoading(false);
      setIsConfirmed(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-100 min-h-screen bg-grey-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full h-full max-w-4xl mt-12 relative">

        {/* 🔴 TOP-LEFT CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full shadow"
        >
          <FaTimes size={18} />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
          <FaReceipt /> Add New Bill
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4 text-center">
            ❌ {error}
          </div>
        )}
        {showSuccess && (
          <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-3 rounded mb-4 text-center">
            ✅ Bill uploaded successfully!
          </div>
        )}

        {dropdownLoading ? (
          <div className="text-center py-4 text-gray-500">
            Loading vehicles and drivers...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* VEHICLE + DRIVER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Vehicle</label>
                <select
                  name="vehicle_id"
                  value={bill.vehicle_id}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.vehicle_id} value={v.vehicle_id}>
                      {v.vehicle_number} - {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Driver</label>
                <select
                  name="driver_id"
                  value={bill.driver_id}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Driver</option>
                  {drivers.map((d) => (
                    <option key={d.driver_id} value={d.driver_id}>
                      {d.name} ({d.nic})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* BILL TYPE + DATE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Bill Type</label>
                <select
                  name="bill_type"
                  value={bill.bill_type}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select Bill Type</option>
                  {billTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Bill Date</label>
                <input
                  type="date"
                  name="bill_date"
                  value={bill.bill_date}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>

            {/* STATUS */}
            <div>
              <label className="label">Status</label>
              <select
                name="bill_status"
                value={bill.bill_status}
                onChange={handleChange}
                className="input"
              >
                {billStatusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* BILL IMAGE */}
            <div className="flex flex-col items-center">
              <label className="label mb-2">Bill Image</label>
              <div className="relative w-48 h-48 border-2 border-dashed rounded-xl bg-gray-50 hover:bg-green-50 transition flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <FaUpload className="text-3xl mb-2" />
                    <p>Upload Bill</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* CONFIRM WRAPPER */}
            <ConfirmWrapper
              onConfirm={() => setIsConfirmed(true)}
              onCancel={() => setIsConfirmed(false)}
              message="Confirm Bill Upload"
              additionalInfo="Please check the bill details before submitting."
              confirmText="Yes, Upload Bill"
              cancelText="No, Go Back"
              icon={<FaReceipt />}
              buttonBackgroundColor="bg-green-600"
              buttonTextColor="text-white"
            >
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Bill"}
              </button>
            </ConfirmWrapper>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddBillModal;
