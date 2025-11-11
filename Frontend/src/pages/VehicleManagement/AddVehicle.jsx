import { useEffect, useState } from "react";
import { FaCarSide, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";

const AddVehicle = () => {
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

  // Fetch owners and fuels
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

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

  // File change with preview
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

  // Submit
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
        setTimeout(() => navigate("/vehicle-management"), 2000);
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
    handleSubmit(new Event("submit"));
  };

  const handleCancel = () => setIsConfirmed(false);

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-green-50 to-green-100 min-h-screen p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-6xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700 flex items-center justify-center gap-2">
          <FaCarSide /> Add New Vehicle
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="vehicle_number"
              placeholder="Vehicle Number"
              value={vehicle.vehicle_number}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              name="name"
              placeholder="Vehicle Name"
              value={vehicle.name}
              onChange={handleChange}
              className="input"
              required
            />
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

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              name="rent_cost_daily"
              placeholder="Daily Rent Cost"
              value={vehicle.rent_cost_daily}
              onChange={handleChange}
              className="input"
            />
            <select
              name="ac_type"
              value={vehicle.ac_type}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select AC Type</option>
              {acTypes.map((t) => (
                <option key={t} value={t}>
                  {t === "Non_AC" ? "Non-AC" : "AC"}
                </option>
              ))}
            </select>
            <select
              name="fuel_id"
              value={vehicle.fuel_id}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select Fuel</option>
              {fuels.map((f) => (
                <option key={f.fuel_id} value={f.fuel_id}>
                  {f.type} - Rs.{f.cost}
                </option>
              ))}
            </select>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              name="owner_id"
              value={vehicle.owner_id}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select Owner</option>
              {owners.map((o) => (
                <option key={o.owner_id} value={o.owner_id}>
                  {o.name || o.owner_name} ({o.nic})
                </option>
              ))}
            </select>
            <input
              type="number"
              name="owner_cost_monthly"
              placeholder="Owner Monthly Cost"
              value={vehicle.owner_cost_monthly}
              onChange={handleChange}
              className="input"
            />
            <input
              type="number"
              name="mileage_cost"
              placeholder="Mileage Cost"
              value={vehicle.mileage_cost}
              onChange={handleChange}
              className="input"
            />
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

          {/* ✅ FIXED Upload Section */}
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

          {/* Confirm Wrapper */}
          <ConfirmWrapper
            onConfirm={handleConfirm}
            onCancel={handleCancel}
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
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Vehicle"}
            </button>
          </ConfirmWrapper>

          <button
            type="button"
            onClick={() => navigate("/vehicle-management")}
            className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
