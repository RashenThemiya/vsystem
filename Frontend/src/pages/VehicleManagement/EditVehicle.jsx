import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCarSide, FaUpload } from "react-icons/fa";
import axios from "axios";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { name: loggedUser, role } = useAuth();

  const [vehicle, setVehicle] = useState({});
  const [owners, setOwners] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [preview, setPreview] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const vehicleTypes = ["Car", "Van", "Bus", "Bike"];
  const acTypes = ["AC", "Non_AC"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized! Please log in first.");
          navigate("/login");
          return;
        }

        const [ownersRes, fuelsRes, vehicleRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/owners`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/fuels`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setOwners(ownersRes.data?.data || ownersRes.data || []);
        setFuels(fuelsRes.data?.data || fuelsRes.data || []);

        const data = vehicleRes.data;

        setVehicle({
          vehicle_number: data.vehicle_number || "",
          name: data.name || "",
          type: data.type || "",
          rent_cost_daily: data.rent_cost_daily || "",
          ac_type: data.ac_type || "",
          fuel_id: data.fuel_id || "",
          owner_id: data.owner_id || "",
          owner_cost_monthly: data.owner_cost_monthly || "",
          mileage_cost: data.mileage_costs?.[0]?.mileage_cost || "",
          mileage_cost_additional: data.mileage_costs?.[0]?.mileage_cost_additional || "",
          license_expiry_date: data.license_expiry_date?.split("T")[0] || "",
          insurance_expiry_date: data.insurance_expiry_date?.split("T")[0] || "",
          eco_test_expiry_date: data.eco_test_expiry_date?.split("T")[0] || "",
          vehicle_fuel_efficiency: data.vehicle_fuel_efficiency || "",
          meter_number: data.meter_number || "",
          last_service_meter_number: data.last_service_meter_number || "",
          vehicle_availability: data.vehicle_availability || "Yes",
          license_image: data.license_image,
          insurance_card_image: data.insurance_card_image,
          eco_test_image: data.eco_test_image,
          book_image: data.book_image,
          image: data.image,
        });

        setPreview({
          license_image: data.license_image,
          insurance_card_image: data.insurance_card_image,
          eco_test_image: data.eco_test_image,
          book_image: data.book_image,
          image: data.image,
        });
      } catch (err) {
        setError("Failed to fetch vehicle details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

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
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/vehicles/${id}`,
        vehicle,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShowSuccess(true);
      setTimeout(() => navigate("/vehicle-management"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update vehicle");
    } finally {
      setSaving(false);
      setIsConfirmed(false);
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    handleSubmit(new Event("submit"));
  };

  const handleCancel = () => setIsConfirmed(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading vehicle data...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-green-50 to-green-100 min-h-screen p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-6xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700 flex items-center justify-center gap-2">
          <FaCarSide /> Edit Vehicle
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4 text-center">
            ❌ {error}
          </div>
        )}
        {showSuccess && (
          <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-3 rounded mb-4 text-center">
            ✅ Vehicle updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Vehicle Number</label>
              <input name="vehicle_number" value={vehicle.vehicle_number} onChange={handleChange} className="input" readOnly />
            </div>

            <div>
              <label className="label">Vehicle Name</label>
              <input name="name" value={vehicle.name} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="label">Vehicle Type</label>
              <select name="type" value={vehicle.type} onChange={handleChange} className="input">
                <option value="">Select Type</option>
                {vehicleTypes.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* Cost and AC Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Daily Rent Cost (Rs)</label>
              <input type="number" name="rent_cost_daily" value={vehicle.rent_cost_daily} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="label">AC Type</label>
              <select name="ac_type" value={vehicle.ac_type} onChange={handleChange} className="input">
                <option value="">Select AC Type</option>
                {acTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Fuel Type</label>
              <select name="fuel_id" value={vehicle.fuel_id} onChange={handleChange} className="input">
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
              <select name="owner_id" value={vehicle.owner_id} onChange={handleChange} className="input">
                <option value="">Select Owner</option>
                {owners.map((o) => (
                  <option key={o.owner_id} value={o.owner_id}>
                    {o.owner_name || o.name} ({o.nic})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Owner Monthly Cost (Rs)</label>
              <input type="number" name="owner_cost_monthly" value={vehicle.owner_cost_monthly} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="label">Mileage Cost (Rs/km)</label>
              <input type="number" name="mileage_cost" value={vehicle.mileage_cost} onChange={handleChange} className="input" />
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Additional Mileage Cost (Rs/km)</label>
              <input type="number" name="mileage_cost_additional" value={vehicle.mileage_cost_additional} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="label">Current Meter Number</label>
              <input type="number" name="meter_number" value={vehicle.meter_number} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="label">Last Service Meter Number</label>
              <input type="number" name="last_service_meter_number" value={vehicle.last_service_meter_number} onChange={handleChange} className="input" />
            </div>
          </div>

          {/* Fuel Efficiency */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Fuel Efficiency (km/l)</label>
              <input type="number" step="0.1" name="vehicle_fuel_efficiency" value={vehicle.vehicle_fuel_efficiency} onChange={handleChange} className="input" />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">License Expiry Date</label>
              <input type="date" name="license_expiry_date" value={vehicle.license_expiry_date} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Insurance Expiry Date</label>
              <input type="date" name="insurance_expiry_date" value={vehicle.insurance_expiry_date} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Eco Test Expiry Date</label>
              <input type="date" name="eco_test_expiry_date" value={vehicle.eco_test_expiry_date} onChange={handleChange} className="input" />
            </div>
          </div>

          {/* Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
            {[
              ["license_image", "License Image"],
              ["insurance_card_image", "Insurance Card"],
              ["eco_test_image", "Eco Test"],
              ["book_image", "Vehicle Book"],
              ["image", "Main Vehicle Image"],
            ].map(([name, label]) => (
              <div key={name} className="flex flex-col items-center relative">
                <label className="label mb-2 text-sm font-medium text-gray-700">{label}</label>
                <div className="relative w-36 h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-green-50 transition overflow-hidden">
                  {preview[name] ? (
                    <img src={preview[name]} alt={label} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <FaUpload className="text-gray-400 text-2xl mb-2" />
                      <p className="text-xs text-gray-500 text-center">Upload</p>
                    </>
                  )}
                  <input type="file" accept="image/*" name={name} onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                </div>
              </div>
            ))}
          </div>

          {/* Confirm Wrapper */}
          <ConfirmWrapper
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            message="Confirm Vehicle Update"
            additionalInfo="Please verify all changes before saving."
            confirmText="Yes, Save Changes"
            cancelText="No, Go Back"
            icon={<FaCarSide />}
            buttonBackgroundColor="bg-blue-600"
            buttonTextColor="text-white"
          >
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition" disabled={saving}>
              {saving ? "Updating..." : "Save Changes"}
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

export default EditVehicle;
