import React, { useEffect, useState } from "react";
import api from "../../../utils/axiosInstance";

const TripPrintModal = ({ open, onClose, tripId, onSuccess }) => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) fetchTrip();
  }, [open, tripId]);

  const fetchTrip = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTrip(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch trip details for printing");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (v) =>
    v == null ? "-" : `Rs. ${Number(v).toLocaleString()}`;
  const formatDate = (d) => (d ? new Date(d).toLocaleString() : "-");

  const handlePrint = () => {
    if (!trip) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Trip #${tripId} Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2, h3, h4 { margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>Trip #${tripId} Details</h2>
          <h3>Status & Payment</h3>
          <p>Status: ${trip.trip_status} | Payment: ${trip.payment_status}</p>

          <h3>Participants</h3>
          <p><strong>Customer:</strong> ${trip.customer?.name || "-"}</p>
          <p><strong>Driver:</strong> ${trip.driver?.name || "-"}</p>
          <p><strong>Vehicle:</strong> ${trip.vehicle?.name || "-"}</p>

          ${trip.customer ? `
          <h4>Customer Details</h4>
          <p>Name: ${trip.customer.name}</p>
          <p>NIC: ${trip.customer.nic}</p>
          <p>Phone: ${trip.customer.phone_number}</p>
          <p>Email: ${trip.customer.email}</p>
          ` : ''}

          ${trip.driver ? `
          <h4>Driver Details</h4>
          <p>Name: ${trip.driver.name}</p>
          <p>Phone: ${trip.driver.phone_number}</p>
          <p>NIC: ${trip.driver.nic}</p>
          <p>Age: ${trip.driver.age}</p>
          <p>License: ${trip.driver.license_number}</p>
          <p>Charges: ${formatCurrency(trip.driver.driver_charges)}</p>
          ` : ''}

          ${trip.vehicle ? `
          <h4>Vehicle Details</h4>
          <p>Name: ${trip.vehicle.name}</p>
          <p>Number: ${trip.vehicle.vehicle_number}</p>
          <p>Type: ${trip.vehicle.type}</p>
          <p>AC Type: ${trip.vehicle.ac_type}</p>
          <p>Fuel Efficiency: ${trip.vehicle.vehicle_fuel_efficiency ? trip.vehicle.vehicle_fuel_efficiency + " km/l" : "-"}</p>
          <p>License Expiry: ${trip.vehicle.license_expiry_date ? new Date(trip.vehicle.license_expiry_date).toLocaleDateString() : "-"}</p>
          <p>Insurance Expiry: ${trip.vehicle.insurance_expiry_date ? new Date(trip.vehicle.insurance_expiry_date).toLocaleDateString() : "-"}</p>
          <p>Last Service Meter: ${trip.vehicle.last_service_meter_number}</p>
          ` : ''}

          <h3>Trip Summary</h3>
          <table>
            <tbody>
              <tr><th>From</th><td>${trip.from_location}</td></tr>
              <tr><th>To</th><td>${trip.to_location}</td></tr>
              <tr><th>Up/Down</th><td>${trip.up_down}</td></tr>
              <tr><th>Passengers</th><td>${trip.num_passengers}</td></tr>
              <tr><th>Driver Required</th><td>${trip.driver_required}</td></tr>
              <tr><th>Fuel Required</th><td>${trip.fuel_required}</td></tr>
            </tbody>
          </table>

          <h3>Distance & Route</h3>
          <table>
            <tbody>
              <tr><th>Estimated Distance</th><td>${trip.estimated_distance || "-"} km</td></tr>
              <tr><th>Actual Distance</th><td>${trip.actual_distance || "-"} km</td></tr>
              <tr><th>Start Meter</th><td>${trip.start_meter || "-"}</td></tr>
              <tr><th>End Meter</th><td>${trip.end_meter || "-"}</td></tr>
            </tbody>
          </table>

          ${trip.map?.length ? `
            <h4>Route / Map</h4>
            <ol>
              ${trip.map.sort((a,b)=>a.sequence-b.sequence).map(m => `<li>${m.sequence}. ${m.location_name} (${m.latitude}, ${m.longitude})</li>`).join('')}
            </ol>
          ` : `<p>No map locations recorded</p>`}

          <h3>Dates</h3>
          <table>
            <tbody>
              <tr><th>Leaving Date</th><td>${formatDate(trip.leaving_datetime)}</td></tr>
              <tr><th>Estimated Return</th><td>${formatDate(trip.estimated_return_datetime)}</td></tr>
              <tr><th>Actual Return</th><td>${formatDate(trip.actual_return_datetime)}</td></tr>
              <tr><th>Estimated Days</th><td>${trip.estimated_days || "-"}</td></tr>
              <tr><th>Actual Days</th><td>${trip.actual_days || "-"}</td></tr>
            </tbody>
          </table>

          <h3>Cost Summary</h3>
          <table>
            <tbody>
              <tr><th>Vehicle Rent (Daily)</th><td>${formatCurrency(trip.vehicle_rent_daily)}</td></tr>
              <tr><th>Driver Cost</th><td>${formatCurrency(trip.driver_cost)}</td></tr>
              <tr><th>Fuel Cost</th><td>${formatCurrency(trip.fuel_cost)}</td></tr>
              <tr><th>Mileage Extra Cost</th><td>${formatCurrency(trip.additional_mileage_cost)}</td></tr>
              <tr><th>Mileage Cost</th><td>${formatCurrency(trip.mileage_cost)}</td></tr>
              <tr><th>Discount</th><td>${formatCurrency(trip.discount)}</td></tr>
              <tr><th>Damage Cost</th><td>${formatCurrency(trip.damage_cost)}</td></tr>
              <tr><th>Total Estimated Cost</th><td>${formatCurrency(trip.total_estimated_cost)}</td></tr>
              <tr><th>Total Actual Cost</th><td>${formatCurrency(trip.total_actual_cost)}</td></tr>
            </tbody>
          </table>

          ${trip.other_trip_costs?.length ? `
            <h4>Other Trip Costs</h4>
            <ul>
              ${trip.other_trip_costs.map(c => `<li>${c.cost_type}: ${formatCurrency(c.cost_amount)}</li>`).join('')}
            </ul>
          ` : ''}

          <h3>Payments</h3>
          ${trip.payments?.length ? `
            <table>
              <thead><tr><th>Date</th><th>Amount</th></tr></thead>
              <tbody>
                ${trip.payments.map(p => `<tr><td>${formatDate(p.payment_date)}</td><td>${formatCurrency(p.amount)}</td></tr>`).join('')}
              </tbody>
            </table>
          ` : `<p>No payments recorded</p>`}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Close modal after printing is done
    printWindow.onafterprint = () => {
      onClose();
      onSuccess();
    };

    printWindow.print();
  };

  if (!open) return null;
  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 text-white">
        Loading...
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-xl w-96">
        <h2 className="text-xl font-semibold mb-4">Print Trip #{tripId}</h2>
        <p className="mb-4 text-gray-600">
          This will open the trip details in a printable format.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripPrintModal;
