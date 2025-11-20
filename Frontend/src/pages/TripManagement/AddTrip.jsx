import { useEffect, useState, useRef } from "react";
import { FaMapMarkerAlt, FaCarSide, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";

const GOOGLE_MAPS_API_KEY = "AIzaSyCRk-FYPlKX3xi51W9PHTd35fELrAvBs-0"; // Keep or replace with env var if you prefer

const AddTrip = () => {
  const navigate = useNavigate();
  const { name: loggedUser, role } = useAuth();

  const [trip, setTrip] = useState({
    customer_id: "",
    vehicle_id: "",
    driver_id: "",
    from_location: "",
    to_location: "",
    waypoints: [], // address strings
    up_down: "Both",
    estimated_distance: "",
    estimated_days: "",
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

  // Map refs
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const directionsRendererRef = useRef(null);
  const directionsServiceRef = useRef(null);

  // Input refs for autocomplete
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const waypointRefs = useRef([]); // dynamic refs for each waypoint input

  // Load Google Maps script once
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 7.8731, lng: 80.7718 },
      zoom: 7,
    });

    directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
    directionsServiceRef.current = new window.google.maps.DirectionsService();
    directionsRendererRef.current.setMap(mapInstance.current);

    // Attach autocomplete for from/to inputs if present
    enableAutocompleteForInput(fromInputRef, (address) => {
      updateTripField("from_location", address);
    });
    enableAutocompleteForInput(toInputRef, (address) => {
      updateTripField("to_location", address);
    });

    // Click on map behavior
    mapInstance.current.addListener("click", (e) => {
      const latLng = e.latLng;
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const address = results[0].formatted_address;
          setTrip((prev) => {
            if (!prev.from_location) {
              return { ...prev, from_location: address };
            }
            if (!prev.to_location) {
              return { ...prev, to_location: address };
            }
            // otherwise add waypoint
            return { ...prev, waypoints: [...prev.waypoints, address] };
          });
          // give state a tick then calculate
          setTimeout(() => calculateRoute(), 300);
        }
      });
    });
  };

  // Generic function to attach autocomplete to an input ref
  const enableAutocompleteForInput = (inputRef, onPlaceSelected) => {
    if (!inputRef?.current || !window.google) return;
    try {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          onPlaceSelected(place.formatted_address);
        } else if (place?.name) {
          // fallback
          onPlaceSelected(place.name);
        }
      });
    } catch (err) {
      // ignore if script not fully ready
      console.warn("Autocomplete attach failed", err);
    }
  };

  // When waypoint inputs change length, attach autocomplete to their refs
  useEffect(() => {
    if (!window.google) return;
    waypointRefs.current.forEach((ref, index) => {
      if (!ref) return;
      // avoid attaching multiple listeners by storing a marker on the element
      if (!ref._autocompleteAttached) {
        try {
          const auto = new window.google.maps.places.Autocomplete(ref);
          auto.addListener("place_changed", () => {
            const place = auto.getPlace();
            if (place?.formatted_address || place?.name) {
              handleWaypointChange(index, place.formatted_address || place.name);
            }
          });
          ref._autocompleteAttached = true;
        } catch (err) {
          console.warn("Waypoint autocomplete attach failed", err);
        }
      }
    });
    // re-run whenever waypoints length changes
  }, [trip.waypoints.length]);

  // Fetch dropdown data (vehicles, customers, drivers)
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const [vehiclesRes, customersRes, driversRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/customers`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/drivers`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setVehicles(vehiclesRes.data || []);
        setCustomers(customersRes.data?.data || customersRes.data || []);
        setDrivers(driversRes.data?.data || driversRes.data || []);
      } catch (err) {
        setError("Failed to load dropdown data.");
      }
    };
    fetchData();
  }, [navigate]);

  // Cost calculation helper (same logic from your original)
  const calculateTotalEstimatedCost = (updatedTrip, selectedVehicle) => {
    const numDays = Number(updatedTrip.estimated_days || 0);
    const totalDistance = Number(updatedTrip.estimated_distance || 0);

    const defaultDistance = Math.min(numDays * 100, totalDistance);
    const additionalDistance = Math.max(totalDistance - numDays * 100, 0);

    const mileageCost = selectedVehicle?.mileage_cost || 0;
    const additionalMileageCost = selectedVehicle?.additional_mileage_cost || 0;
    const defaultDistanceCost = defaultDistance * mileageCost;
    const additionalDistanceCost = additionalDistance * additionalMileageCost;

    let vehicleBookingCost = 0;
    if (selectedVehicle) {
      if (selectedVehicle.leased) vehicleBookingCost = (selectedVehicle.lease / 30) * numDays;
      else if (selectedVehicle.owner_rent) vehicleBookingCost = (selectedVehicle.owner_rent / 30) * numDays;
    }

    const driverCostPerDay = selectedVehicle?.driver_cost || 0;
    const driverCost = updatedTrip.driver_required === "Yes" ? driverCostPerDay * numDays : 0;

    const otherCostsSum = updatedTrip.other_trip_costs.reduce((acc, c) => acc + Number(c.cost || 0), 0);
    const discount = Number(updatedTrip.discount || 0);
    const damageCost = Number(updatedTrip.damage_cost || 0);

    const total = driverCost + vehicleBookingCost + defaultDistanceCost + additionalDistanceCost + otherCostsSum - discount + damageCost;

    return total;
  };

  // Core calculateRoute uses Google Directions API to render on map + compute distance + fill map_locations
  const calculateRoute = () => {
    if (!trip.from_location || !trip.to_location) return;

    const waypoints = trip.waypoints.map((wp) => ({ location: wp, stopover: true }));

    if (!directionsServiceRef.current || !directionsRendererRef.current) return;

    directionsServiceRef.current.route(
      {
        origin: trip.from_location,
        destination: trip.to_location,
        travelMode: window.google.maps.TravelMode.DRIVING,
        waypoints,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRendererRef.current.setDirections(result);

          // calculate total distance and map locations
          let totalDistanceMeters = 0;
          const route = result.routes[0];
          const legs = route.legs || [];

          // compile map locations with lat/lng from legs
          const mapLocations = [];
          legs.forEach((leg, i) => {
            totalDistanceMeters += leg.distance.value;
            // start location for first leg
            if (i === 0) {
              mapLocations.push({
                location_name: trip.from_location,
                latitude: leg.start_location.lat(),
                longitude: leg.start_location.lng(),
              });
            }
            // for each waypoint leg, capture its end as a waypoint or final destination will be added later
            mapLocations.push({
              location_name: leg.end_address || (trip.waypoints[i] || trip.to_location),
              latitude: leg.end_location.lat(),
              longitude: leg.end_location.lng(),
            });
          });

          const totalDistanceKm = (totalDistanceMeters / 1000).toFixed(2);

          // update trip with estimated_distance and map_locations
          setTrip((prev) => {
            const updated = { ...prev };
            updated.estimated_distance = totalDistanceKm;
            updated.map_locations = mapLocations;
            // recalc cost
            const selVeh = vehicles.find((v) => Number(v.vehicle_id) === Number(updated.vehicle_id));
            updated.total_estimated_cost = calculateTotalEstimatedCost(updated, selVeh);
            return updated;
          });
        } else {
          console.error("Failed to calculate route:", status);
          // optionally show message to user
        }
      }
    );
  };

  // Recalculate route when these trip fields change
  useEffect(() => {
    // only calculate if both from & to are present
    if (trip.from_location && trip.to_location) {
      calculateRoute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip.from_location, trip.to_location, trip.waypoints.join("|")]);

  // Generic update handler for text/number/select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedTrip = { ...trip, [name]: value };

    // Auto-fill Estimated Return Date when leaving_datetime or estimated_days changes
    if (name === "leaving_datetime" || name === "estimated_days") {
      const leavingDate = new Date(updatedTrip.leaving_datetime);
      const days = parseInt(updatedTrip.estimated_days || 0, 10);
      if (!isNaN(leavingDate.getTime()) && days > 0) {
        leavingDate.setDate(leavingDate.getDate() + days);
        updatedTrip.estimated_return_datetime = leavingDate.toISOString().slice(0, 16);
      } else {
        updatedTrip.estimated_return_datetime = "";
      }
    }

    // Payment sync logic
    if (name === "payment_amount" && updatedTrip.payment_amount && !updatedTrip.advance_payment) updatedTrip.advance_payment = updatedTrip.payment_amount;
    else if (name === "advance_payment" && updatedTrip.advance_payment && !updatedTrip.payment_amount) updatedTrip.payment_amount = updatedTrip.advance_payment;

    updatedTrip.payment_status = updatedTrip.advance_payment && Number(updatedTrip.advance_payment) > 0 ? "Partially_Paid" : "Unpaid";

    // Recompute estimated cost after change
    const selectedVehicle = vehicles.find((v) => Number(v.vehicle_id) === Number(updatedTrip.vehicle_id));
    updatedTrip.total_estimated_cost = calculateTotalEstimatedCost(updatedTrip, selectedVehicle);

    setTrip(updatedTrip);
  };

  // Helper used by autocomplete to set a field and trigger route calc
  const updateTripField = (field, value) => {
    setTrip((prev) => {
      const updated = { ...prev, [field]: value };
      // if we set leaving_datetime or estimated_days ensure return date calc will be preserved by handleChange flow elsewhere
      return updated;
    });
    // run calculate after a small delay to ensure state updated
    setTimeout(() => {
      if (field === "from_location" || field === "to_location") calculateRoute();
    }, 300);
  };

  // Other trip costs handlers
  const addOtherCost = () => setTrip((prev) => ({ ...prev, other_trip_costs: [...prev.other_trip_costs, { cost_type: "", cost: 0 }] }));
  const handleCostChange = (index, field, value) => {
    const updatedCosts = [...trip.other_trip_costs];
    updatedCosts[index][field] = field === "cost" ? Number(value) : value;

    const selectedVehicle = vehicles.find((v) => Number(v.vehicle_id) === Number(trip.vehicle_id));
    const updatedTrip = { ...trip, other_trip_costs: updatedCosts };
    updatedTrip.total_estimated_cost = calculateTotalEstimatedCost(updatedTrip, selectedVehicle);

    setTrip(updatedTrip);
  };
  const removeOtherCost = (index) => {
    const updatedCosts = [...trip.other_trip_costs];
    updatedCosts.splice(index, 1);

    const selectedVehicle = vehicles.find((v) => Number(v.vehicle_id) === Number(trip.vehicle_id));
    const updatedTrip = { ...trip, other_trip_costs: updatedCosts };
    updatedTrip.total_estimated_cost = calculateTotalEstimatedCost(updatedTrip, selectedVehicle);

    setTrip(updatedTrip);
  };

  // Waypoint handlers
  const addWaypoint = () => {
    setTrip((prev) => ({ ...prev, waypoints: [...prev.waypoints, ""] }));
    // keep waypointRefs array in sync (ref will be attached by JSX)
  };
  const removeWaypoint = (index) => {
    setTrip((prev) => {
      const wps = [...prev.waypoints];
      wps.splice(index, 1);
      return { ...prev, waypoints: wps };
    });
    // remove ref marker so effect will reattach properly
    waypointRefs.current.splice(index, 1);
    setTimeout(() => calculateRoute(), 200);
  };
  const handleWaypointChange = (index, value) => {
    setTrip((prev) => {
      const wps = [...prev.waypoints];
      wps[index] = value;
      return { ...prev, waypoints: wps };
    });
    setTimeout(() => calculateRoute(), 300);
  };

  // Confirm wrapper handlers
  const handleConfirm = () => {
    setIsConfirmed(true);
    // programmatically submit by calling handleSubmit (we can simulate by directly invoking)
    document.getElementById("add-trip-form")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  };
  const handleCancel = () => setIsConfirmed(false);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmed) return; // confirm required
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
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add trip");
    } finally {
      setLoading(false);
      setIsConfirmed(false);
    }
  };

return (
  <div className="flex justify-center items-center bg-gradient-to-br from-green-50 to-green-100 min-h-screen p-6">
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-7xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700 flex items-center justify-center gap-2">
        <FaMapMarkerAlt /> Add New Trip
      </h2>

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

      <form id="add-trip-form" onSubmit={handleSubmit} className="space-y-6">

        {/* ---------- TWO COLUMN LAYOUT ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ---------------- LEFT COLUMN: ALL FORM INPUTS ---------------- */}
          <div className="space-y-6">

            {/* Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Customer</label>
                <select
                  name="customer_id"
                  value={trip.customer_id}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.admin_id || c.id} value={c.admin_id || c.id}>
                      {c.name} {c.nic ? `- ${c.nic}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Vehicle</label>
                <select
                  name="vehicle_id"
                  value={trip.vehicle_id}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.vehicle_id || v.id} value={v.vehicle_id || v.id}>
                      {v.name} ({v.vehicle_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Driver (Optional)</label>
                <select
                  name="driver_id"
                  value={trip.driver_id}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Driver</option>
                  {drivers.map((d) => (
                    <option key={d.driver_id || d.id} value={d.driver_id || d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">From Location</label>
                <input
                  type="text"
                  ref={fromInputRef}
                  name="from_location"
                  value={trip.from_location}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">To Location</label>
                <input
                  type="text"
                  ref={toInputRef}
                  name="to_location"
                  value={trip.to_location}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>

            {/* Waypoints */}
            {/* Waypoints */}
<div className="bg-gray-50 p-4 rounded-xl border">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-lg font-semibold">Waypoints (Route Order)</h3>

    <button
      type="button"
      onClick={addWaypoint}
      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
    >
      <FaPlus /> Add
    </button>
  </div>

  {trip.waypoints.length === 0 && (
    <p className="text-gray-500 text-sm italic">No waypoints added</p>
  )}

  <div className="space-y-3">
    {trip.waypoints.map((wp, i) => (
      <div
        key={i}
        className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border-l-4 border-green-600"
      >
        {/* ORDER CIRCLE */}
        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
          {i + 1}
        </div>

        {/* INPUT */}
        <input
          type="text"
          ref={(el) => (waypointRefs.current[i] = el)}
          value={wp}
          onChange={(e) => handleWaypointChange(i, e.target.value)}
          placeholder={`Enter waypoint ${i + 1}`}
          className="input flex-1"
        />

        {/* DELETE BUTTON */}
        <button
          type="button"
          onClick={() => removeWaypoint(i)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </button>
      </div>
    ))}
  </div>
</div>


            {/* Trip Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Estimated Distance (km)</label>
                <input
                  type="number"
                  name="estimated_distance"
                  value={trip.estimated_distance}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">Estimated Days</label>
                <input
                  type="number"
                  name="estimated_days"
                  value={trip.estimated_days}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">Number of Passengers</label>
                <input
                  type="number"
                  name="num_passengers"
                  value={trip.num_passengers}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            {/* Other Trip Costs */}
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
                Other Trip Costs
                <button
                  type="button"
                  onClick={addOtherCost}
                  className="text-green-600 hover:text-green-800"
                >
                  <FaPlus />
                </button>
              </h3>

              {trip.other_trip_costs.map((cost, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 mb-2">
                  <select
                    value={cost.cost_type}
                    onChange={(e) =>
                      handleCostChange(index, "cost_type", e.target.value)
                    }
                    className="input"
                    required
                  >
                    <option value="">Select Cost Type</option>
                    <option value="Meal">Meal</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Driver_Accommodation">Driver Accommodation</option>
                    <option value="Driver_Meal">Driver Meal</option>
                    <option value="Other">Other</option>
                  </select>

                  <input
                    type="number"
                    value={cost.cost}
                    onChange={(e) =>
                      handleCostChange(index, "cost", e.target.value)
                    }
                    className="input"
                    placeholder="Cost Amount"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => removeOtherCost(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Cost */}
            <div>
              <label className="label font-bold">Total Estimated Cost (Rs)</label>
              <input
                type="number"
                value={trip.total_estimated_cost}
                className="input bg-gray-100"
                readOnly
              />
            </div>
          </div>

          {/* ---------------- RIGHT COLUMN: MAP ---------------- */}
          <div className="space-y-4">
            <div
              ref={mapRef}
              style={{ width: "100%", height: "550px" }}
              className="rounded-xl border shadow"
            ></div>

            <button
              type="button"
              onClick={calculateRoute}
              className="btn-blue w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Calculate Route & Distance
            </button>
          </div>

        </div>

        {/* CONFIRM SUBMIT */}
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
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Trip"}
          </button>
        </ConfirmWrapper>

        {/* CANCEL BUTTON */}
        <button
          type="button"
          onClick={() => navigate("/trip-management")}
          className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Cancel
        </button>

      </form>
    </div>
  </div>
);

};

export default AddTrip;
