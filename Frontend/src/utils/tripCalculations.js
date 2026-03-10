// src/utils/tripCalculations.js

export const calculateTotalEstimatedCost = ({ trip = {}, selectedVehicle = {}, selectedDriver = {} }) => {
  const numDays = Number(trip.estimated_days) || 1;
  const distance = Number(trip.estimated_distance) || 0;

  const vehicleDaily = Number(selectedVehicle?.rent_cost_daily) || Number(selectedVehicle?.owner_rent) || 0;
  const mileageCost = Number(selectedVehicle?.mileage_cost) || 0;
  const additionalMileageCost = Number(selectedVehicle?.additional_mileage_cost) || 0;
  const fuelCostPerLitre = Number(selectedVehicle?.fuel_cost) || 0;
  const fuelEfficiency = Number(selectedVehicle?.fuel_efficiency) || 0;
  const driverDailyCost = Number(trip.driver_cost) || 0;
  const damageCost = Number(trip.damage_cost) || 0;

  const otherCosts = (trip.other_trip_costs || []).reduce((sum, c) => sum + (Number(c.cost) || 0), 0);

  const fuelCost = fuelEfficiency > 0 ? (distance / fuelEfficiency) * fuelCostPerLitre : 0;

  const defaultDistance = Math.min(numDays * 100, distance);
  const additionalDistance = Math.max(distance - numDays * 100, 0);

  const defaultDistanceCost = defaultDistance * mileageCost;
  const additionalDistanceCost = additionalDistance * additionalMileageCost;

  const driverCost = trip.driver_required === "Yes" ? driverDailyCost * numDays : 0;

  const grossTripAmount = vehicleDaily * numDays + defaultDistanceCost + additionalDistanceCost + driverCost + otherCosts;

  let discount = Number(trip.discount) || 0;
  if (discount > grossTripAmount) discount = grossTripAmount;

  const totalTripAmount = grossTripAmount - discount - damageCost;

  const grossProfit = grossTripAmount - (fuelCost + driverCost + otherCosts + vehicleDaily * numDays);
  const finalProfit = grossProfit - discount;

  return {
    totalEstimatedCost: totalTripAmount,
    profit: finalProfit,
    discount,
  };
};
