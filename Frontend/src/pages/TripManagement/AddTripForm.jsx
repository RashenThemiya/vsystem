// src/pages/AddTripForm.jsx
import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { calculateTotalEstimatedCost } from "../../utils/tripCalculations";

const AddTripForm = ({
  trip,
  setTrip,
  vehicles = [],
  customers = [],
  drivers = [],
  handleChange,
  addWaypoint,
  removeWaypoint,
  handleWaypointChange,
  selectedVehicle,
  selectedDriver,
  waypointRefs,
  addOtherCost,
  handleCostChange,
  removeOtherCost,
  fromInputRef,
  toInputRef,
}) => {
  const [totalCost, setTotalCost] = useState(trip.total_estimated_cost || 0);
  const [profit, setProfit] = useState(trip.profit || 0);

  const waypoints = Array.isArray(trip.waypoints) ? trip.waypoints : [];
  const otherCosts = Array.isArray(trip.other_trip_costs) ? trip.other_trip_costs : [];

  // ----------------------------
  // 🟣 CALCULATE TOTAL + PROFIT USING UTILITY
  // ----------------------------
  useEffect(() => {
    const { totalEstimatedCost, profit: prof, discount } =
      calculateTotalEstimatedCost({ trip, selectedVehicle, selectedDriver });

    setTotalCost(totalEstimatedCost);
    setProfit(prof);

    if (setTrip) {
      setTrip({
        ...trip,
        total_estimated_cost: totalEstimatedCost,
        profit: prof,
        discount: discount || 0,
      });
    }
  }, [
    trip.estimated_days,
    trip.estimated_distance,
    trip.discount,
    trip.damage_cost,
    trip.other_trip_costs,
    trip.trip_type,
    selectedVehicle,
    selectedDriver,
  ]);

  // ----------------------------
  // 🟣 HANDLE WAYPOINT CHANGE
  // ----------------------------
  const onWaypointChange = (index, value) => {
    setTrip(prev => {
      const newWaypoints = [...(prev.waypoints || [])];
      newWaypoints[index] = value;
      return { ...prev, waypoints: newWaypoints };
    });
  };

  // ----------------------------
  // 🟣 AUTO-FILL ADVANCE PAYMENT & STATUS
  // ----------------------------
  useEffect(() => {
    const payment = Number(trip.payment_amount || 0);
    if (setTrip) {
      setTrip(prev => ({
        ...prev,
        advance_payment: payment,
        payment_status: payment > 0 ? "Partially_Paid" : "Unpaid",
      }));
    }
  }, [trip.payment_amount, setTrip]);

  return (
    <div className="space-y-6">
      {/* Customer, Vehicle, Driver */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Customer</label>
          <select
            name="customer_id"
            value={trip.customer_id || ""}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Customer</option>
            {customers.map(c => (
              <option key={c.customer_id} value={c.customer_id}>
                {c.name} {c.nic ? `- ${c.nic}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Vehicle</label>
          <select
            name="vehicle_id"
            value={trip.vehicle_id || ""}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Vehicle</option>
            {vehicles.map(v => (
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
            value={trip.driver_id || ""}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Driver</option>
            {drivers.map(d => (
              <option key={d.driver_id || d.id} value={d.driver_id || d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vehicle Details */}
      {selectedVehicle && (
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-300 mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-purple-700">Vehicle Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>Fuel Type: <span className="font-medium">{selectedVehicle.fuel?.type}</span></div>
            <div>Fuel Cost (Rs/L): <span className="font-medium">{selectedVehicle.fuel_cost}</span></div>
            <div>Fuel Efficiency (km/L): <span className="font-medium">{selectedVehicle.fuel_efficiency}</span></div>
            <div>Mileage Cost (Rs/km): <span className="font-medium">{selectedVehicle.mileage_cost}</span></div>
            <div>Additional Mileage Cost (Rs/km): <span className="font-medium">{selectedVehicle.additional_mileage_cost}</span></div>
            <div>Daily Rent / Lease: <span className="font-medium">{selectedVehicle.rent_cost_daily || selectedVehicle.owner_rent}</span></div>
          </div>
        </div>
      )}

      {/* Driver Details */}
      {selectedDriver && (
        <div className="bg-pink-50 p-4 rounded-xl border border-pink-300 mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-pink-700">Driver Details</h3>
          <div>Driver Name: <span className="font-medium">{selectedDriver.name}</span></div>
          <div>Driver Cost per Day (Rs): <span className="font-medium">{selectedDriver.driver_cost}</span></div>
        </div>
      )}

      {/* Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">From Location</label>
          <input
            ref={fromInputRef}
            type="text"
            name="from_location"
            value={trip.from_location || ""}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label className="label">To Location</label>
          <input
            ref={toInputRef}
            type="text"
            name="to_location"
            value={trip.to_location || ""}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
      </div>

      {/* Waypoints */}
      <div className="bg-gray-50 p-4 rounded-xl border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Waypoints (Route Order)</h3>
          <button
            type="button"
            onClick={addWaypoint}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-800"
          >
            <FaPlus /> Add
          </button>
        </div>

        {waypoints.length === 0 && <p className="text-gray-500 text-sm italic">No waypoints added</p>}

        <div className="space-y-3">
          {waypoints.map((wp, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border-l-4 border-purple-600"
            >
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">{i + 1}</div>
              <input
                type="text"
                ref={(el) => (waypointRefs.current[i] = el)}
                value={wp}
                onChange={(e) => onWaypointChange(i, e.target.value)}
                placeholder={`Enter waypoint ${i + 1}`}
                className="input flex-1"
              />
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
          <label className="label">Leaving Date & Time</label>
          <input
            type="datetime-local"
            name="leaving_datetime"
            value={trip.leaving_datetime || ""}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div>
          <label className="label">Estimated Return Date & Time</label>
          <input
            type="datetime-local"
            name="estimated_return_datetime"
            value={trip.estimated_return_datetime || ""}
            onChange={handleChange}
            className="input"
            required
            min={trip.leaving_datetime || ""}
          />
        </div>
        <div>
          <label className="label">Estimated Days</label>
          <input
            type="number"
            name="estimated_days"
            value={trip.estimated_days || ""}
            onChange={handleChange}
            className="input"
            min="1"
            required
          />
        </div>
        <div>
          <label className="label">Estimated Distance (km)</label>
          <input
            type="number"
            name="estimated_distance"
            value={trip.estimated_distance || ""}
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
            value={trip.num_passengers || ""}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label className="label">Trip Type</label>
          <select
            name="trip_type"
            value={trip.trip_type || ""}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="Daily">Daily</option>
            <option value="Special">Special</option>
          </select>
        </div>
      </div>

      {/* Other Trip Costs */}
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
          Other Trip Costs
          <button
            type="button"
            onClick={addOtherCost}
            className="text-purple-600 hover:text-purple-800"
          >
            <FaPlus />
          </button>
        </h3>

        {otherCosts.map((cost, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-2">
            <select
              value={cost.cost_type || ""}
              onChange={(e) => handleCostChange(index, "cost_type", e.target.value)}
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
              value={cost.cost || ""}
              onChange={(e) => handleCostChange(index, "cost", e.target.value)}
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

      {/* Discount */}
      <div>
        <label className="label font-semibold">Discount (Rs)</label>
        <input
          type="number"
          name="discount"
          value={trip.discount || 0}
          onChange={handleChange}
          className="input"
          min="0"
          placeholder="Enter discount amount"
        />
      </div>

      {/* Total Cost & Profit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-5 rounded-xl bg-gray-100 border border-gray-300 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-700">Total Estimated Cost</h4>
          <p className="text-3xl font-bold text-gray-900 mt-2">Rs {totalCost.toLocaleString()}</p>
        </div>

        <div className="p-5 rounded-xl bg-purple-100 border border-purple-300 shadow-sm">
          <h4 className="text-lg font-semibold text-purple-700">Profit</h4>
          <p className="text-3xl font-bold text-purple-900 mt-2">Rs {profit.toLocaleString()}</p>
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-pink-50 p-4 rounded-xl border border-pink-300">
        <h3 className="text-lg font-semibold mb-3 text-pink-700">Payment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Payment Amount (Rs)</label>
            <input
              type="number"
              name="payment_amount"
              value={trip.payment_amount || ""}
              onChange={handleChange}
              className="input"
              min="0"
              required
            />
          </div>
          <div>
            <label className="label">Advance Payment (Rs)</label>
            <input
              type="number"
              name="advance_payment"
              value={trip.advance_payment || ""}
              className="input bg-gray-100 cursor-not-allowed"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTripForm;
