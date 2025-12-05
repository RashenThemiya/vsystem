import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";
import dayjs from "dayjs";

const VehicleProfile = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [filter, setFilter] = useState("all");
  const [totalEarning, setTotalEarning] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  useEffect(() => {
    if (vehicle) applyFilter(filter);
  }, [vehicle, filter]);

  const fetchVehicle = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/vehicles/${id}`);
      setVehicle(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch vehicle details.");
    } finally {
      setLoading(false);
    }
  };

  const calculateEarning = (trips) => {
    const total = trips
      .filter((t) => t.trip_status === "Completed")
      .reduce((sum, t) => sum + Number(t.payment_amount || 0), 0);
    setTotalEarning(total);
  };

  const applyFilter = (status) => {
    if (!vehicle?.trips) return;
    let trips = [...vehicle.trips];
    if (status !== "all") trips = trips.filter((t) => t.trip_status === status);
    setFilteredTrips(trips);
    calculateEarning(trips);
  };

  const openImage = (img) => {
    if (!img) return;
    const win = window.open();
    win.document.write(`<img src="${img}" style="width:100%"/>`);
  };

  if (loading) return <p className="p-6">Loading vehicle...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!vehicle) return <p className="p-6">No vehicle found.</p>;

  const images = [
    { label: "Vehicle", src: vehicle.image },
    { label: "License", src: vehicle.license_image },
    { label: "Insurance", src: vehicle.insurance_card_image },
    { label: "Eco Test", src: vehicle.eco_test_image },
    { label: "Book", src: vehicle.book_image },
  ];

  const vehicleMileageCost = vehicle.mileage_costs?.[0]?.mileage_cost || 0;
  const vehicleAdditionalMileageCost = vehicle.mileage_costs?.[0]?.mileage_cost_additional || 0;

  return (
    <div className="p-6 space-y-8">
      {/* VEHICLE HEADER CARD */}
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-40 h-40 rounded-full border-4 border-purple-600 object-cover shadow-md"
          />
        </div>
        <div className="flex-1 space-y-2">
          <h2 className="text-3xl font-bold text-purple-700">{vehicle.name}</h2>
          <div className="flex flex-wrap gap-4 text-gray-700">
            <p><strong>Number:</strong> {vehicle.vehicle_number}</p>
            <p><strong>Type:</strong> {vehicle.type}</p>
            <p><strong>Daily Rent:</strong> Rs. {vehicle.rent_cost_daily}</p>
            <p><strong>AC:</strong> {vehicle.ac_type}</p>
            <p><strong>Owner Cost/Month:</strong> Rs. {vehicle.owner_cost_monthly}</p>
            <p><strong>Fuel:</strong> {vehicle.fuel?.type} (Rs. {vehicle.fuel?.cost})</p>
            <p><strong>Fuel Efficiency:</strong> {vehicle.vehicle_fuel_efficiency} km/L</p>
            <p><strong>Meter:</strong> {vehicle.meter_number} km</p>
            <p><strong>Last Service:</strong> {vehicle.last_service_meter_number} km</p>
            <p><strong>Availability:</strong> {vehicle.vehicle_availability}</p>
            <p><strong>Owner:</strong> {vehicle.owner?.owner_name} ({vehicle.owner?.contact_number})</p>
            <p><strong>Mileage Cost:</strong> Rs. {vehicleMileageCost}</p>
            <p><strong>Additional Mileage:</strong> Rs. {vehicleAdditionalMileageCost}</p>
          </div>
        </div>
      </div>

      {/* DOCUMENTS */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Documents</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images
            .filter((img) => img.src)
            .map((img) => (
              <div
                key={img.label}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => openImage(img.src)}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 bg-gray-100 text-center text-sm font-semibold">{img.label}</div>
              </div>
            ))}
        </div>
      </div>

      {/* TRIP FILTER BUTTONS */}
      <div className="flex flex-wrap gap-3">
        {["all", "Pending", "Ongoing", "Ended", "Completed", "Cancelled"].map((status) => (
          <button
            key={status}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              filter === status
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-purple-400 hover:text-white"
            }`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* TOTAL EARNINGS */}
      <div className="bg-green-100 p-4 rounded-lg shadow text-lg font-semibold text-green-800">
        Total Earnings (Completed Trips Only): Rs. {totalEarning.toLocaleString()}
      </div>

      {/* TRIPS TABLE */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        {filteredTrips.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No trips found.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Trip ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Driver</th>
                <th className="p-3 text-left">From</th>
                <th className="p-3 text-left">To</th>
                <th className="p-3 text-left">Passengers</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Driver Cost</th>
                <th className="p-3 text-left">Mileage</th>
                <th className="p-3 text-left">Additional Mileage</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map((t) => (
                <tr key={t.trip_id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-2">{t.trip_id}</td>
                  <td className="p-2">{t.customer_id}</td>
                  <td className="p-2">{t.driver_id || "-"}</td>
                  <td className="p-2">{t.from_location}</td>
                  <td className="p-2">{t.to_location}</td>
                  <td className="p-2">{t.num_passengers}</td>
                  <td className="p-2">{t.payment_amount || "-"}</td>
                  <td className="p-2">{t.driver_cost || "0"}</td>
                  <td className="p-2">{t.mileage_cost || "0"}</td>
                  <td className="p-2">{t.additional_mileage_cost || "0"}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        t.trip_status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : t.trip_status === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : t.trip_status === "Cancelled"
                          ? "bg-red-200 text-red-800"
                          : "bg-blue-200 text-blue-800"
                      }`}
                    >
                      {t.trip_status}
                    </span>
                  </td>
                  <td className="p-2">{dayjs(t.created_at).format("YYYY-MM-DD HH:mm")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VehicleProfile;
