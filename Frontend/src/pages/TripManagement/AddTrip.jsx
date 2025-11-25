import { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt, FaCarSide, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";
import AddTripForm from "./AddTripForm";
import AddTripMap from "./AddTripMap";

const GOOGLE_MAPS_API_KEY = "AIzaSyCRk-FYPlKX3xi51W9PHTd35fELrAvBs-0";

const AddTrip = () => {
  const navigate = useNavigate();
  const { name: loggedUser, role } = useAuth();

  const [trip, setTrip] = useState({
    customer_id: "",
    vehicle_id: "",
    driver_id: "",
    from_location: "",
    to_location: "",
    waypoints: [],
    up_down: "Both",
    estimated_distance: "",
    estimated_days: 1,
    driver_required: "Yes",
    fuel_required: "Yes",
    num_passengers: "",
    discount: 0,
    damage_cost: 0,
    payment_amount: 0,
    advance_payment: 0,
    start_meter: "",
    end_meter: "",
    total_estimated_cost: 0,
    total_actual_cost: 0,
    payment_status: "Unpaid",
    trip_status: "Pending",
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

  // Fetch dropdowns
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const [vehiclesRes, customersRes, driversRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles`, {
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
      } catch (err) {
        setError("Failed to load dropdown data.");
      }
    };

    fetchData();
  }, [navigate]);

  // Calculate total estimated cost
  const calculateTotalEstimatedCost = (updatedTrip, selectedVehicle) => {
    const numDays = Number(updatedTrip.estimated_days || 0);
    const totalDistance = Number(updatedTrip.estimated_distance || 0);

    const defaultDistance = Math.min(numDays * 100, totalDistance);
    const additionalDistance = Math.max(totalDistance - numDays * 100, 0);

    const mileageCost = selectedVehicle?.mileage_cost || 0;
    const additionalMileageCost = selectedVehicle?.additional_mileage_cost || 0;
    const defaultDistanceCost = defaultDistance * mileageCost;
    const additionalDistanceCost = additionalDistance * additionalMileageCost;

    let vehicleBookingCostPerDay = 0;
    if (selectedVehicle) {
      if (selectedVehicle.leased) vehicleBookingCostPerDay = selectedVehicle.lease / 30;
      else if (selectedVehicle.owner_rent) vehicleBookingCostPerDay = selectedVehicle.owner_rent / 30;
    }
    const vehicleBookingCost = vehicleBookingCostPerDay * numDays;

    const driverCostPerDay = selectedVehicle?.driver_cost || 0;
    const driverCost = updatedTrip.driver_required === "Yes" ? driverCostPerDay * numDays : 0;

    const otherCostsSum = updatedTrip.other_trip_costs.reduce((acc, c) => acc + Number(c.cost || 0), 0);

    let discount = Number(updatedTrip.discount || 0);
    const damageCost = Number(updatedTrip.damage_cost || 0);

    const tripTotalAmount = driverCost + vehicleBookingCost + defaultDistanceCost + additionalDistanceCost + otherCostsSum - discount + damageCost;

    const fuelCostTotal = selectedVehicle?.fuel_cost && selectedVehicle?.fuel_efficiency
      ? (totalDistance / selectedVehicle.fuel_efficiency) * selectedVehicle.fuel_cost
      : 0;

    let profit = tripTotalAmount - driverCost - vehicleBookingCost - fuelCostTotal;

    if (discount > profit) discount = profit;

    return {
      totalEstimatedCost: tripTotalAmount,
      profit,
      discount,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedTrip = { ...trip, [name]: value };

    if (name === "leaving_datetime" || name === "estimated_return_datetime" || name === "estimated_days") {
      const leaving = new Date(updatedTrip.leaving_datetime);
      const returning = new Date(updatedTrip.estimated_return_datetime);
      const days = Number(updatedTrip.estimated_days || 0);

      if (!isNaN(leaving) && !isNaN(returning)) {
        const diffMs = returning - leaving;
        updatedTrip.estimated_days = diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 1;
      } else if (!isNaN(leaving) && name === "estimated_days" && days > 0) {
        leaving.setDate(leaving.getDate() + days);
        updatedTrip.estimated_return_datetime = leaving.toISOString().slice(0, 16);
      }
    }

    if (name === "payment_amount") {
      updatedTrip.payment_amount = Number(value);
      updatedTrip.advance_payment = Number(value);
      updatedTrip.payment_status = Number(value) > 0 ? "Partly_Paid" : "Unpaid";
    }

    if (name === "advance_payment") {
      updatedTrip.advance_payment = Number(value);
      if (!updatedTrip.payment_amount) updatedTrip.payment_amount = Number(value);
      updatedTrip.payment_status = Number(updatedTrip.advance_payment) > 0 ? "Partly_Paid" : "Unpaid";
    }

    const selectedVehicle = vehicles.find(v => Number(v.vehicle_id) === Number(updatedTrip.vehicle_id) || Number(v.id) === Number(updatedTrip.vehicle_id));
    const { totalEstimatedCost, profit, discount } = calculateTotalEstimatedCost(updatedTrip, selectedVehicle);

    updatedTrip.total_estimated_cost = totalEstimatedCost;
    updatedTrip.profit = profit;
    updatedTrip.discount = discount;

    setTrip(updatedTrip);
  };

  const addWaypoint = () => setTrip((prev) => ({ ...prev, waypoints: [...prev.waypoints, ""] }));
  const removeWaypoint = (index) => {
    setTrip((prev) => {
      const wps = [...prev.waypoints];
      wps.splice(index, 1);
      return { ...prev, waypoints: wps };
    });
    waypointRefs.current.splice(index, 1);
  };
  const handleWaypointChange = (index, value) => {
    setTrip((prev) => {
      const wps = [...prev.waypoints];
      wps[index] = value;
      return { ...prev, waypoints: wps };
    });
  };

  const addOtherCost = () => setTrip((prev) => ({ ...prev, other_trip_costs: [...prev.other_trip_costs, { cost_type: "", cost: 0 }] }));
  const handleCostChange = (index, field, value) => {
    const updatedCosts = [...trip.other_trip_costs];
    updatedCosts[index][field] = field === "cost" ? Number(value) : value;
    const selectedVehicle = vehicles.find((v) => Number(v.vehicle_id) === Number(trip.vehicle_id));
    setTrip((prev) => ({ ...prev, other_trip_costs: updatedCosts, total_estimated_cost: calculateTotalEstimatedCost({ ...prev, other_trip_costs: updatedCosts }, selectedVehicle) }));
  };
  const removeOtherCost = (index) => {
    const updatedCosts = [...trip.other_trip_costs];
    updatedCosts.splice(index, 1);
    const selectedVehicle = vehicles.find((v) => Number(v.vehicle_id) === Number(trip.vehicle_id));
    setTrip((prev) => ({ ...prev, other_trip_costs: updatedCosts, total_estimated_cost: calculateTotalEstimatedCost({ ...prev, other_trip_costs: updatedCosts }, selectedVehicle) }));
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    document.getElementById("add-trip-form")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  };
  const handleCancel = () => setIsConfirmed(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmed) return;
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/trips`, trip, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (res.status === 200 || res.status === 201) {
        setShowSuccess(true);
        setTimeout(() => navigate("/trip-management"), 2000);
      } else setError("Unexpected response from server.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add trip");
    } finally {
      setLoading(false);
      setIsConfirmed(false);
    }
  };

  const selectedVehicle = vehicles.find(v => Number(v.vehicle_id) === Number(trip.vehicle_id) || Number(v.id) === Number(trip.vehicle_id));
  const selectedDriver = drivers.find(d => Number(d.driver_id) === Number(trip.driver_id) || Number(d.id) === Number(trip.driver_id));

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Professional Heading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold text-green-800 flex items-center gap-2">
            <FaMapMarkerAlt /> Trip Creation
          </h2>
          <button
            onClick={() => navigate("/trip-management")}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded transition"
          >
            <FaArrowLeft /> Back to Trips
          </button>
        </div>

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

        {/* Left form + right full map */}
        <form id="add-trip-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AddTripForm
              trip={trip}
              vehicles={vehicles}
              customers={customers}
              drivers={drivers}
              selectedVehicle={selectedVehicle}
              selectedDriver={selectedDriver}
              handleChange={handleChange}
              addWaypoint={addWaypoint}
              removeWaypoint={removeWaypoint}
              handleWaypointChange={handleWaypointChange}
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
              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition mt-4" disabled={loading}>
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
