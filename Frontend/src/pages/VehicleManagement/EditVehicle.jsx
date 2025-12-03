import { useEffect, useState } from "react";
import { FaCarSide, FaUpload } from "react-icons/fa";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import api from "../../utils/axiosInstance";

export default function EditVehicleForm({ vehicle: initialVehicle, onCancel, onSuccess }) {
  const [vehicle, setVehicle] = useState(initialVehicle || {});
  const [owners, setOwners] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [preview, setPreview] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const vehicleTypes = ["Car", "Van", "Bus", "Bike"];
  const acTypes = ["AC", "Non_AC"];

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const token = localStorage.getItem("token");
        const [ownersRes, fuelsRes] = await Promise.all([
          api.get("/api/owners", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/api/fuels", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setOwners(ownersRes.data?.data || ownersRes.data || []);
        setFuels(fuelsRes.data?.data || fuelsRes.data || []);
      } catch (err) {
        setError("Failed to fetch owners or fuels data.");
      }
    };

    fetchMeta();

    if (initialVehicle) {
      setVehicle(initialVehicle);
      setPreview({
        license_image: initialVehicle.license_image,
        insurance_card_image: initialVehicle.insurance_card_image,
        eco_test_image: initialVehicle.eco_test_image,
        book_image: initialVehicle.book_image,
        image: initialVehicle.image,
      });
    }

    setLoading(false);
  }, [initialVehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setVehicle((prev) => ({ ...prev, [name]: base64 }));
      setPreview((prev) => ({ ...prev, [name]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmed) return;

    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await api.put(`/api/vehicles/${vehicle.vehicle_id}`, vehicle, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess(res.data); // updated vehicle back to parent
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

  if (loading) return <div className="flex justify-center items-center min-h-[300px] text-gray-500">Loading vehicle data...</div>;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex justify-center items-start overflow-auto z-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-6xl mt-12">
      <h2 className="text-xl font-semibold mb-6 text-center text-black-700 flex items-center justify-center gap-2">
         Edit Vehicle
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4 text-center">
          ❌ {error}
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

        {/* Costs & AC */}
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
              {fuels.map((f) => <option key={f.fuel_id} value={f.fuel_id}>{f.type} - Rs.{f.cost}</option>)}
            </select>
          </div>
        </div>

        {/* Owner & Mileage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Owner</label>
            <select name="owner_id" value={vehicle.owner_id} onChange={handleChange} className="input">
              <option value="">Select Owner</option>
              {owners.map((o) => (
                <option key={o.owner_id} value={o.owner_id}>{o.owner_name || o.name} ({o.nic})</option>
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

        {/* Fuel Efficiency & Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Fuel Efficiency (km/l)</label>
            <input type="number" step="0.1" name="vehicle_fuel_efficiency" value={vehicle.vehicle_fuel_efficiency} onChange={handleChange} className="input" />
          </div>
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

        {/* Images */}
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

        {/* Confirm & Cancel */}
        <ConfirmWrapper onConfirm={handleConfirm} onCancel={() => setIsConfirmed(false)} message="Confirm Vehicle Update">
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition" disabled={saving}>
            {saving ? "Updating..." : "Save Changes"}
          </button>
        </ConfirmWrapper>

        <button type="button" onClick={onCancel} className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition mt-2">
          Cancel
        </button>
      </form>
      </div>
    </div>
  );
}
