// src/pages/AddTripForm.jsx
import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const AddTripForm = ({
  trip,
  setTrip,
  vehicles,
  customers,
  drivers,
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

  // ----------------------------
  // 🟢 CALCULATE TOTAL + PROFIT
  // ----------------------------
  useEffect(() => {
  // -------------------------
  // SAFE NUMERIC INPUTS

  const numDays = Number(trip.estimated_days) || 1;
  const distance = Number(trip.estimated_distance) || 0;

  // Vehicle numeric fields
  const vehicleDaily = Number(selectedVehicle?.rent_cost_daily) ||
                       Number(selectedVehicle?.owner_rent) || 0;

  const mileageCost = Number(selectedVehicle?.mileage_cost) || 0;
  const additionalMileageCost = Number(selectedVehicle?.additional_mileage_cost) || 0;
  const fuelCostPerLitre = Number(selectedVehicle?.fuel_cost) || 0;
  const fuelEfficiency = Number(selectedVehicle?.fuel_efficiency) || 0;

  // Driver numeric fields
  const driverDailyCost = Number(selectedDriver?.driver_cost) || 0;

  // Damage numeric
  const damageCost = Number(trip.damage_cost) || 0;

  // Other trip costs numeric array
  const otherCosts = trip.other_trip_costs.reduce(
    (sum, c) => sum + (Number(c.cost) || 0),
    0
  );

  // -------------------------
  // CALCULATE FUEL COST
  // -------------------------
  const fuelCost =
    fuelEfficiency > 0 ? (distance / fuelEfficiency) * fuelCostPerLitre : 0;

  // -------------------------
  // DISTANCE CALCULATION
  // -------------------------
  const defaultDistance = Math.min(numDays * 100, distance);
  const additionalDistance = Math.max(distance - numDays * 100, 0);

  const defaultDistanceCost = defaultDistance * mileageCost;
  const additionalDistanceCost = additionalDistance * additionalMileageCost;

  // -------------------------
  // DRIVER COST (if required)
  // -------------------------
  const driverCost =
    selectedDriver && trip.driver_required === "Yes"
      ? driverDailyCost * numDays
      : 0;

  // -------------------------
  // TOTAL BEFORE DISCOUNT
  // -------------------------
  const grossTripAmount =
    vehicleDaily * numDays +
    defaultDistanceCost +
    additionalDistanceCost +
    driverCost +
    otherCosts;

  // -------------------------
  // VALIDATE DISCOUNT (NUMERIC SAFE)
  // -------------------------
  let discount = Number(trip.discount);

  if (isNaN(discount) || discount < 0) discount = 0;
  if (discount > grossTripAmount) discount = grossTripAmount;

  // -------------------------
  // TOTAL AFTER DISCOUNT
  // -------------------------
  const totalTripAmount = grossTripAmount - discount + damageCost;

  // -------------------------
  // PROFIT CALCULATION
  // -------------------------
  const grossProfit =
    grossTripAmount - (fuelCost + driverCost + otherCosts + vehicleDaily * numDays);

  const finalProfit = grossProfit - discount;

  // -------------------------
  // UPDATE STATE + TRIP
  // -------------------------
  setTotalCost(totalTripAmount);
  setProfit(finalProfit);

  if (setTrip) {
    setTrip({
      ...trip,
      total_estimated_cost: totalTripAmount,
      profit: finalProfit,
      discount: discount,
    });
  }
}, [
  trip.estimated_days,
  trip.estimated_distance,
  trip.other_trip_costs,
  trip.discount,
  trip.damage_cost,
  selectedVehicle,
  selectedDriver,
]);


  // ----------------------------
  // JSX RETURN
  // ----------------------------
  return (
    <div className="space-y-6">

      {/* Customer, Vehicle, Driver */}
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

      {/* Vehicle Details */}
      {selectedVehicle && (
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-300 mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-yellow-700">Vehicle Details</h3>
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
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-300 mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-blue-700">Driver Details</h3>
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
            value={trip.from_location}
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
            value={trip.to_location}
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
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                {i + 1}
              </div>
              <input
                type="text"
                ref={(el) => (waypointRefs.current[i] = el)}
                value={wp}
                onChange={(e) => handleWaypointChange(i, e.target.value)}
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
            value={trip.leaving_datetime}
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
            value={trip.estimated_return_datetime}
            onChange={handleChange}
            className="input"
            required
            min={trip.leaving_datetime}
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
            min="1"
            required
          />
        </div>
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

      {/* Discount Field */}
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

      {/* Total cost + Profit */}
     {/* Total Cost & Profit Display Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
  
  {/* Total Estimated Cost */}
  <div className="p-5 rounded-xl bg-gray-100 border border-gray-300 shadow-sm">
    <h4 className="text-lg font-semibold text-gray-700">Total Estimated Cost</h4>
    <p className="text-3xl font-bold text-gray-900 mt-2">
      Rs {totalCost.toLocaleString()}
    </p>
  </div>

  {/* Profit */}
  <div className="p-5 rounded-xl bg-green-100 border border-green-300 shadow-sm">
    <h4 className="text-lg font-semibold text-green-700">Profit</h4>
    <p className="text-3xl font-bold text-green-900 mt-2">
      Rs {profit.toLocaleString()}
    </p>
  </div>

</div>


      {/* Payment Section */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-300">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">
          Payment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Payment Amount (Rs)</label>
            <input
              type="number"
              name="payment_amount"
              value={trip.payment_amount}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Advance Payment (Rs)</label>
            <input
              type="number"
              name="advance_payment"
              value={trip.advance_payment}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTripForm;
