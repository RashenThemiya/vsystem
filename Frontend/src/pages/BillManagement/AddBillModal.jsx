import { useEffect, useState } from "react";
import { FaReceipt, FaUpload } from "react-icons/fa";
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
    bill_image: "",
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

  const billTypes = [
    "Service_Cost",
    "Repair_Cost",
    "Other_Cost",
    "Fuel_Bill",
    "Insurance",
    "License",
  ];

  const billStatusOptions = ["pending", "completed"];

  // Fetch vehicles and drivers
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

        console.log("Vehicle Response:", vehicleRes.data);
        console.log("Driver Response:", driverRes.data);

        setVehicles(vehicleRes.data?.data || vehicleRes.data || []);
        setDrivers(driverRes.data?.data || driverRes.data || []);
      } catch (err) {
        console.error("Dropdown fetch error:", err.response || err);
        setError("Failed to load vehicles or drivers.");
      } finally {
        setDropdownLoading(false);
      }
    };

    fetchDropdowns();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBill((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setBill((prev) => ({
        ...prev,
        bill_image: reader.result.split(",")[1], // save base64 only
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmed) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/bill-uploads`,
        bill,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        setShowSuccess(true);
        onSuccess(res.data.data);

        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload bill.");
    } finally {
      setLoading(false);
      setIsConfirmed(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex justify-center items-start overflow-auto z-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl mt-12">

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
          <div className="text-center py-4 text-gray-500">Loading vehicles and drivers...</div>
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
                  required
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
                  <img src={preview} className="w-full h-full object-cover rounded-xl" />
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
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Bill"}
              </button>
            </ConfirmWrapper>

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddBillModal;
