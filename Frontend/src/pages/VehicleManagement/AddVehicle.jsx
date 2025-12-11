import { FaTimes, FaCheck, FaCarSide, FaUpload } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";

const AddVehicleModal = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { name: loggedUser, role } = useAuth();

  const [vehicle, setVehicle] = useState({
    vehicle_number: "",
    name: "",
    type: "",
    rent_cost_daily: "",
    ac_type: "",
    owner_id: "",
    fuel_id: "",
    owner_cost_monthly: "",
    mileage_cost: "",
    mileage_cost_additional: "",
    meter_number: "",
    last_service_meter_number: "",
    license_expiry_date: "",
    insurance_expiry_date: "",
    eco_test_expiry_date: "",
    vehicle_fuel_efficiency: "",
    license_image: "",
    insurance_card_image: "",
    eco_test_image: "",
    book_image: "",
    image: "",
  });

  const [owners, setOwners] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [preview, setPreview] = useState({});

  const vehicleTypes = ["Car", "Van", "Bus", "Bike"];
  const acTypes = ["AC", "Non_AC"];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized! Please log in first.");
        navigate("/login");
        return;
      }

      try {
        const [ownersRes, fuelsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/owners`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/fuels`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setOwners(ownersRes.data?.data || ownersRes.data || []);
        setFuels(fuelsRes.data?.data || fuelsRes.data || []);
      } catch (err) {
        setError("Failed to load dropdown data. Please try again.");
      }
    };
    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        setVehicle((prev) => ({ ...prev, [name]: base64 }));
        setPreview((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmed) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/vehicles`,
        vehicle,
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

        setTimeout(() => onClose(), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
      setIsConfirmed(false);
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  return (
    <div className="fixed inset-0 bg-white/40 bg-opacity-40 backdrop-blur-md flex justify-center items-start overflow-auto z-50 p-6">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl mt-12 relative p-8">

        {/* Top Buttons */}
        <div className="absolute top-4 left-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 shadow"
            title="Close"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="absolute top-4 right-4">
          <ConfirmWrapper
            onConfirm={handleConfirm}
            onCancel={() => setIsConfirmed(false)}
            message="Confirm Adding Vehicle"
            additionalInfo="Please verify all vehicle details before submission."
            confirmText="Yes, Add Vehicle"
            cancelText="No, Go Back"
            icon={<FaCarSide />}
            buttonBackgroundColor="bg-green-600"
            buttonTextColor="text-white"
          >
            <button
              type="submit"
              className="p-2 rounded-full bg-green-200 hover:bg-green-300 text-green-700 shadow"
              disabled={loading}
              title="Confirm"
            >
              <FaCheck size={18} />
            </button>
          </ConfirmWrapper>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
          Add New Vehicle
        </h2>

        {/* Alerts */}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4 text-center">
            ❌ {error}
          </div>
        )}
        {showSuccess && (
          <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-3 rounded mb-4 text-center">
            ✅ Vehicle added successfully!
          </div>
        )}

        {/* Form */}
         <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Vehicle Number</label>
              <input
                name="vehicle_number"
                placeholder="e.g. ABC-1234"
                value={vehicle.vehicle_number}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Vehicle Name</label>
              <input
                name="name"
                placeholder="e.g. Toyota Aqua"
                value={vehicle.name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Vehicle Type</label>
              <select
                name="type"
                value={vehicle.type}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Type</option>
                {vehicleTypes.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cost and AC Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Daily Rent Cost (Rs)</label>
              <input
                type="number"
                name="rent_cost_daily"
                value={vehicle.rent_cost_daily}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">AC Type</label>
              <select
                name="ac_type"
                value={vehicle.ac_type}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select AC Type</option>
                {acTypes.map((t) => (
                  <option key={t} value={t}>
                    {t === "Non_AC" ? "Non-AC" : "AC"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Fuel Type</label>
              <select
                name="fuel_id"
                value={vehicle.fuel_id}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Fuel</option>
                {fuels.map((f) => (
                  <option key={f.fuel_id} value={f.fuel_id}>
                    {f.type} - Rs.{f.cost}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Owner and Mileage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Owner</label>
              <select
                name="owner_id"
                value={vehicle.owner_id}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Owner</option>
                {owners.map((o) => (
                  <option key={o.owner_id} value={o.owner_id}>
                    {o.name || o.owner_name} ({o.nic})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Owner Monthly Cost (Rs)</label>
              <input
                type="number"
                name="owner_cost_monthly"
                value={vehicle.owner_cost_monthly}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Mileage Cost (Rs/km)</label>
              <input
                type="number"
                name="mileage_cost"
                value={vehicle.mileage_cost}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          {/* Additional and Meter Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Additional Mileage Cost (Rs/km)</label>
              <input
                type="number"
                name="mileage_cost_additional"
                value={vehicle.mileage_cost_additional}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Current Meter Number</label>
              <input
                type="number"
                name="meter_number"
                value={vehicle.meter_number}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Last Service Meter Number</label>
              <input
                type="number"
                name="last_service_meter_number"
                value={vehicle.last_service_meter_number}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          {/* Vehicle Efficiency */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Fuel Efficiency (km/l)</label>
              <input
                type="number"
                step="0.1"
                name="vehicle_fuel_efficiency"
                value={vehicle.vehicle_fuel_efficiency}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">License Expiry Date</label>
              <input
                type="date"
                name="license_expiry_date"
                value={vehicle.license_expiry_date}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="label">Insurance Expiry Date</label>
              <input
                type="date"
                name="insurance_expiry_date"
                value={vehicle.insurance_expiry_date}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="label">Eco Test Expiry Date</label>
              <input
                type="date"
                name="eco_test_expiry_date"
                value={vehicle.eco_test_expiry_date}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
            {[
              ["license_image", "License Image"],
              ["insurance_card_image", "Insurance Card"],
              ["eco_test_image", "Eco Test Image"],
              ["book_image", "Vehicle Book"],
              ["image", "Main Vehicle Image"],
            ].map(([name, label]) => (
              <div key={name} className="flex flex-col items-center relative">
                <label className="label mb-2 text-sm font-medium text-gray-700">{label}</label>
                <div className="relative w-36 h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-green-50 transition overflow-hidden">
                  {preview[name] ? (
                    <img
                      src={preview[name]}
                      alt={label}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <FaUpload className="text-gray-400 text-2xl mb-2" />
                      <p className="text-xs text-gray-500 text-center">Upload</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    name={name}
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                </div>
              </div>
            ))}
          </div>
          {/*<ConfirmWrapper
            onConfirm={handleConfirm}
            onCancel={() => setIsConfirmed(false)}
            message="Confirm Adding Vehicle"
            additionalInfo="Please verify all vehicle details before submission."
            confirmText="Yes, Add Vehicle"
            cancelText="No, Go Back"
            icon={<FaCarSide />}
            buttonBackgroundColor="bg-green-600"
            buttonTextColor="text-white"
          >
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Vehicle"}
            </button>
          </ConfirmWrapper>*/}


        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
