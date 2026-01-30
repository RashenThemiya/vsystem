// src/pages/AddTrip.jsx
import { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt, FaCarSide, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";
import AddTripForm from "./AddTripForm";
import AddTripMap from "./AddTripMap";
import { calculateTotalEstimatedCost } from "../../utils/tripCalculations";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const AddTrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const copyTrip = location.state?.copyTrip;
  const { name: loggedUser } = useAuth();

  const [trip, setTrip] = useState({
    customer_id: "",
    vehicle_id: "",
    driver_id: "",
    driver_cost: 0, // ✅ ADD THIS
    from_location: "",
    to_location: "",
    waypoints: [],
    up_down: "Both",
    estimated_distance: 0,
    estimated_days: 1,
    driver_required: "Yes",
    fuel_required: "Yes",
    num_passengers: 0,
    discount: 0,
    damage_cost: 0,
    payment_amount: 0,
    advance_payment: 0,
    start_meter: 0,
    end_meter: 0,
    total_estimated_cost: 0,
    total_actual_cost: 0,
    payment_status: "Unpaid",
    trip_status: "Pending",
    trip_type: "Daily",
    leaving_datetime: "",
    estimated_return_datetime: "",
    map_locations: [],
    other_trip_costs: [],
  });

  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const mapRef = useRef(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const waypointRefs = useRef([]);

  // =========================
  // Helper: map array to trip fields
  // =========================
  const mapToTripLocations = (mapArray = []) => {
    if (!Array.isArray(mapArray) || mapArray.length === 0) {
      return { from_location: "", to_location: "", waypoints: [] };
    }

    const from_location = mapArray[0].location_name || "";
    const to_location = mapArray[mapArray.length - 1].location_name || "";

    const waypoints =
      mapArray.length > 2
        ? mapArray.slice(1, mapArray.length - 1).map((loc) => loc.location_name)
        : [];

    return { from_location, to_location, waypoints };
  };

  // =========================
  // Prefill form if copyTrip exists
  // =========================
  useEffect(() => {
    if (!copyTrip) return;
    console.log("Copying trip data:", copyTrip);

    const { from_location, to_location, waypoints } = mapToTripLocations(copyTrip.map);

    setTrip((prev) => ({
      ...prev,
      customer_id: copyTrip.customer?.customer_id || "",
      vehicle_id: copyTrip.vehicle?.vehicle_id || "",
      driver_id: copyTrip.driver?.driver_id || "",
      from_location,
      to_location,
      waypoints,
      driver_cost: Number(copyTrip.driver_cost || 0), // ✅ KEEP CUSTOM COST

      up_down: copyTrip.up_down || "Both",
      trip_type: copyTrip.trip_type || "Special",
      num_passengers: copyTrip.num_passengers || 0,
      other_trip_costs: copyTrip.other_trip_costs || [],
      // Reset new fields
      start_meter: 0,
      end_meter: 0,
      payment_amount: 0,
      advance_payment: 0,
      payment_status: "Unpaid",
      trip_status: "Pending",
      leaving_datetime: "",
      estimated_return_datetime: "",
    }));
  }, [copyTrip]);

  // =========================
  // Fetch vehicles, drivers, customers
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const [vehiclesRes, customersRes, driversRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles/active`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/customers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/drivers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const formattedVehicles = (vehiclesRes.data || []).map((v) => ({
          ...v,
          fuel_cost: Number(v.fuel?.cost || 0),
          mileage_cost: Number(v.mileage_costs?.[0]?.mileage_cost || 0),
          additional_mileage_cost: Number(v.mileage_costs?.[0]?.mileage_cost_additional || 0),
          fuel_efficiency: Number(v.vehicle_fuel_efficiency || 0),
        }));

        const formattedDrivers = (driversRes.data?.data || driversRes.data || []).map((d) => ({
          ...d,
          driver_cost: Number(d.driver_charges || 0),
        }));

        setVehicles(formattedVehicles);
        setCustomers(customersRes.data?.data || customersRes.data || []);
        setDrivers(formattedDrivers);
      } catch {
        setError("Failed to load dropdown data.");
      }
    };

    fetchData();
  }, [navigate]);

  const selectedVehicle = vehicles.find(
    (v) => Number(v.vehicle_id) === Number(trip.vehicle_id) || Number(v.id) === Number(trip.vehicle_id)
  );
  const selectedDriver = drivers.find(
    (d) => Number(d.driver_id) === Number(trip.driver_id) || Number(d.id) === Number(trip.driver_id)
  );

  // ========================
  // Handle input changes
  // ========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedTrip = { ...trip, [name]: value };

    // Update estimated_days if datetime changes
    if (name === "leaving_datetime" || name === "estimated_return_datetime") {
      const start = new Date(name === "leaving_datetime" ? value : updatedTrip.leaving_datetime);
      const end = new Date(name === "estimated_return_datetime" ? value : updatedTrip.estimated_return_datetime);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        updatedTrip.estimated_days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      }
    }
   if (name === "driver_id") {
      const driver = drivers.find(
        d => Number(d.driver_id) === Number(value) || Number(d.id) === Number(value)
      );
      updatedTrip.driver_cost = driver ? Number(driver.driver_cost) : 0;
    }
    // Recalculate total cost & profit
    const { totalEstimatedCost, profit, discount } = calculateTotalEstimatedCost({
      trip: updatedTrip,
      selectedVehicle,
      selectedDriver,
    });

    updatedTrip.total_estimated_cost = totalEstimatedCost;
    updatedTrip.profit = profit;
    updatedTrip.discount = discount;

    setTrip(updatedTrip);
  };

  // ========================
  // Waypoints & other costs
  // ========================
  const addWaypoint = () => setTrip((prev) => ({ ...prev, waypoints: [...prev.waypoints, ""] }));
  const removeWaypoint = (i) => setTrip((prev) => ({ ...prev, waypoints: prev.waypoints.filter((_, idx) => idx !== i) }));

  const addOtherCost = () => setTrip((prev) => ({ ...prev, other_trip_costs: [...prev.other_trip_costs, { cost_type: "", cost: 0 }] }));
  const handleCostChange = (i, field, value) => {
    const updatedCosts = [...trip.other_trip_costs];
    updatedCosts[i][field] = field === "cost" ? Number(value) : value;
    const { totalEstimatedCost, profit, discount } = calculateTotalEstimatedCost({
      trip: { ...trip, other_trip_costs: updatedCosts },
      selectedVehicle,
      selectedDriver,
    });
    setTrip((prev) => ({ ...prev, other_trip_costs: updatedCosts, total_estimated_cost: totalEstimatedCost, profit, discount }));
  };
  const removeOtherCost = (i) => {
    const updatedCosts = trip.other_trip_costs.filter((_, idx) => idx !== i);
    const { totalEstimatedCost, profit, discount } = calculateTotalEstimatedCost({
      trip: { ...trip, other_trip_costs: updatedCosts },
      selectedVehicle,
      selectedDriver,
    });
    setTrip((prev) => ({ ...prev, other_trip_costs: updatedCosts, total_estimated_cost: totalEstimatedCost, profit, discount }));
  };

  // ========================
  // Confirm & Submit
  // ========================
  const handleConfirm = () => {
    setIsConfirmed(true);
    document.getElementById("add-trip-form")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  };
  const handleCancel = () => setIsConfirmed(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmed || loading) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        customer_id: Number(trip.customer_id),
        vehicle_id: Number(trip.vehicle_id),
        driver_id: trip.driver_id ? Number(trip.driver_id) : null,
        driver_cost: Number(trip.driver_cost || 0), // ✅ SEND TO BACKEND
        from_location: trip.from_location,
        to_location: trip.to_location,
        up_down: trip.up_down,
        estimated_distance: Number(trip.estimated_distance),
        estimated_days: Number(trip.estimated_days),
        driver_required: trip.driver_required,
        fuel_required: trip.fuel_required,
        num_passengers: Number(trip.num_passengers),
        discount: Number(trip.discount || 0),
        damage_cost: Number(trip.damage_cost || 0),
        payment_amount: Number(trip.payment_amount || 0),
        advance_payment: Number(trip.advance_payment || 0),
        start_meter: Number(trip.start_meter || 0),
        end_meter: Number(trip.end_meter || 0),
        total_estimated_cost: Number(trip.total_estimated_cost || 0),
        total_actual_cost: Number(trip.total_actual_cost || 0),
        payment_status: trip.payment_status,
        trip_status: trip.trip_status,
        leaving_datetime: trip.leaving_datetime,
        profit: Number(trip.profit || 0),
        trip_type: trip.trip_type,
        estimated_return_datetime: trip.estimated_return_datetime,
        map_locations: (trip.map_locations || []).map((loc) => ({
          location_name: loc.location_name,
          latitude: Number(loc.latitude),
          longitude: Number(loc.longitude),
        })),
        other_trip_costs: (trip.other_trip_costs || []).map((cost) => ({
          cost_type: cost.cost_type,
          cost: Number(cost.cost),
        })),
      };

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/trips`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (res.status === 200 || res.status === 201) {
        const newTripId = res.data?.data?.trip_id || res.data?.trip_id;
        window.open(`/trip/${newTripId}`, "_blank");

        setTimeout(() => navigate("/trip-dashboard"), 500);
      } else setError("Unexpected response from server.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add trip");
    } finally {
      setLoading(false);
      setIsConfirmed(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-3">
            <div className="animate-spin h-8 w-8 rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-sm font-semibold text-gray-700">Adding trip...</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold text-violet-800 flex items-center gap-2">
            <FaMapMarkerAlt /> Trip Creation
          </h2>
          <button
            onClick={() => navigate("/trip-dashboard")}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded transition"
          >
            <FaArrowLeft /> Back to Trips
          </button>
        </div>

        {copyTrip && (
          <div className="bg-indigo-100 border border-indigo-300 text-indigo-700 px-4 py-3 rounded mb-4 text-center">
            Creating a new trip based on Trip - {copyTrip.trip_id}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4 text-center">
            ❌ {error}
          </div>
        )}

        {showSuccess && (
          <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-3 rounded mb-4 text-center">
            ✅ Trip added successfully!
          </div>
        )}

        <form id="add-trip-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AddTripForm
              trip={trip}
              vehicles={vehicles}
              setTrip={setTrip}
              customers={customers}
              drivers={drivers}
              selectedVehicle={selectedVehicle}
              selectedDriver={selectedDriver}
              handleChange={handleChange}
              addWaypoint={addWaypoint}
              removeWaypoint={removeWaypoint}
              handleWaypointChange={(i, val) => {
                const updatedWaypoints = [...trip.waypoints];
                updatedWaypoints[i] = val;
                setTrip(prev => ({ ...prev, waypoints: updatedWaypoints }));
              }}
              waypointRefs={waypointRefs}
              addOtherCost={addOtherCost}
              handleCostChange={handleCostChange}
              removeOtherCost={removeOtherCost}
              fromInputRef={fromInputRef}
              toInputRef={toInputRef}
            />

            <ConfirmWrapper
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              message="Confirm Adding Trip"
              additionalInfo="Verify all details"
              confirmText="Yes, Add Trip"
              cancelText="No, Go Back"
              icon={<FaCarSide />}
              buttonBackgroundColor="bg-green-600"
              buttonTextColor="text-white"
            >
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition mt-4"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Trip"}
              </button>
            </ConfirmWrapper>
          </div>

          <div className="lg:col-span-2 h-[600px]">
            <AddTripMap
              trip={trip}
              setTrip={setTrip}
              fromInputRef={fromInputRef}
              toInputRef={toInputRef}
              waypointRefs={waypointRefs}
              vehicles={vehicles}
              calculateTotalEstimatedCost={calculateTotalEstimatedCost}
              mapRef={mapRef}
              GOOGLE_MAPS_API_KEY={GOOGLE_MAPS_API_KEY}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrip;
