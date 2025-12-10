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
        <title>Invoice - Trip #${tripId}</title>

        <style>
          @page {
            size: A4;
            margin: 10mm;
          }

          body {
            font-family: Arial, sans-serif;
            width: 100%;
            margin: 0;
            padding: 0;
            font-size: 13px;
          }

          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 10mm;
            box-sizing: border-box;
            margin: auto;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
          }

          .logo {
            height: 80px;
          }

          .title {
            text-align: right;
            font-size: 30px;
            font-weight: bold;
            color: #3C007E;
          }

          h3 {
            margin-bottom: 8px;
            border-bottom: 2px solid #cfcfcf;
            padding-bottom: 4px;
            color: #3C007E;
          }

          .section {
            margin-top: 10px;
          }
          
          .row {
            display: flex;
            justify-content: space-between;
            gap: 15px;
          }

          .col {
            width: 48%;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          th {
            text-align: left;
            background: #f2f2f2;
            padding: 5px;
            border: 1px solid #ccc;
            font-size: 13px;
          }

          td {
            padding: 5px;
            border: 1px solid #ccc;
            font-size: 13px;
          }

          .space {
            margin-bottom: 6px;
          }
        </style>

      </head>

      <body>
        <div class="page">

          <!-- HEADER -->
          <div class="header">
            <img src="/images/CP-Logo.png" class="logo" alt="Company Logo" />
            <div class="title">TRIP INVOICE</div>
          </div>

          <!-- INVOICE META -->
          <div class="section">
            <table>
              <tr><th>Invoice Date</th><td>${trip.leaving_datetime ? new Date(trip.leaving_datetime).toLocaleDateString() : "-"}</td></tr>
              <tr><th>Trip ID</th><td>${tripId}</td></tr>
            </table>
          </div>

          <!-- CUSTOMER + DRIVER -->
          <div class="section row">
            <div class="col">
              <h3>Customer Details</h3>
              <div class="space"><strong>Name:</strong> ${trip.customer?.name || "-"}</div>
              <div class="space"><strong>NIC:</strong> ${trip.customer?.nic || "-"}</div>
              <div class="space"><strong>Phone:</strong> ${trip.customer?.phone_number || "-"}</div>
              <div class="space"><strong>Email:</strong> ${trip.customer?.email || "-"}</div>
            </div>

            <div class="col">
              <h3>Driver Details</h3>
              <div class="space"><strong>Name:</strong> ${trip.driver?.name || "-"}</div>
              <div class="space"><strong>NIC:</strong> ${trip.driver?.nic || "-"}</div>
              <div class="space"><strong>Phone:</strong> ${trip.driver?.phone_number || "-"}</div>
            </div>
          </div>

          <!-- TRIP SUMMARY + VEHICLE -->
          <div class="section row">
            <div class="col">
              <h3>Trip Summary</h3>
              <div class="space"><strong>Leaving Date:</strong> ${formatDate(trip.leaving_datetime)}</div>
              <div class="space"><strong>Estimated Return:</strong> ${formatDate(trip.estimated_return_datetime)}</div>
              <div class="space"><strong>Actual Return:</strong> ${formatDate(trip.actual_return_datetime)}</div>
              <div class="space"><strong>Passenger Count:</strong> ${trip.num_passengers || "-"}</div>
            </div>

            <div class="col">
              <h3>Vehicle Details</h3>
              <div class="space"><strong>Name:</strong> ${trip.vehicle?.name || "-"}</div>
              <div class="space"><strong>Vehicle No:</strong> ${trip.vehicle?.vehicle_number || "-"}</div>
              <div class="space"><strong>Type:</strong> ${trip.vehicle?.type || "-"}</div>
              
            </div>
          </div>

          <!-- DISTANCE + ROUTE -->
          <div class="section row">
            <div class="col">
              <h3>Distance</h3>
              <div class="space"><strong>Estimated Distance:</strong> ${trip.estimated_distance || "-"} km</div>
              <div class="space"><strong>Actual Distance:</strong> ${trip.actual_distance || "-"} km</div>
              <div class="space"><strong>Start Meter:</strong> ${trip.start_meter || "-"}</div>
              <div class="space"><strong>End Meter:</strong> ${trip.end_meter || "-"}</div>
            </div>

            <div class="col">
              <h3>Route</h3>
              ${
                trip.map?.length
                  ? trip.map
                      .sort((a,b)=>a.sequence-b.sequence)
                      .map(m => `<div class="space"><strong>Route ${m.sequence}:</strong> ${m.location_name}</div>`)
                      .join("")
                  : "<div>No routes recorded</div>"
              }
            </div>
          </div>

          <!-- COSTS + PAYMENTS SIDE BY SIDE -->
          <div class="section row">

            <!-- COSTS -->
            <div class="col">
              <h3>Costs</h3>
              <table>
                <tr><th>Vehicle Rent (Daily)</th><td>${formatCurrency(trip.vehicle_rent_daily)}</td></tr>
                <tr><th>Driver Cost</th><td>${formatCurrency(trip.driver_cost)}</td></tr>
                <tr><th>Fuel Cost</th><td>${formatCurrency(trip.fuel_cost)}</td></tr>
                <tr><th>Mileage Cost</th><td>${formatCurrency(trip.mileage_cost)}</td></tr>
                <tr><th>Mileage Extra Cost</th><td>${formatCurrency(trip.additional_mileage_cost)}</td></tr>
                <tr><th>Damage Cost</th><td>${formatCurrency(trip.damage_cost)}</td></tr>
               ${     trip.other_trip_costs?.length
                        ? trip.other_trip_costs
                            .map(
                              (c) =>
                                `<tr>
                                  <th>${c.cost_type}:</th>
                                  <td>${formatCurrency(c.cost_amount)}</td>
                                </tr>`
                            )
                            .join("")
                        : ""
                }
                <tr><th>Discount</th><td>${formatCurrency(trip.discount)}</td></tr>              
              </table>
            </div>

            <!-- PAYMENTS -->
            <div class="col">
              <h3>Payments</h3>
              ${
                trip.payments?.length
                  ? `
                    <table>
                      <thead>
                        <tr><th>Date</th><th>Amount</th></tr>
                      </thead>
                      <tbody>
                        ${trip.payments
                          .map(p => `<tr><td>${formatDate(p.payment_date)}</td><td>${formatCurrency(p.amount)}</td></tr>`)
                          .join("")}
                      </tbody>
                    </table>
                  `
                  : "<p>No payments recorded</p>"
              }
            </div>
          </div>

          <!-- TOTALS -->
          <div class="section">
            <table>
              <tr><th>Total Estimated Cost</th><td>${formatCurrency(trip.total_estimated_cost)}</td></tr>
              <tr><th>Total Payments</th><td>${formatCurrency((trip.payment_ammount))}</td></tr>
              <tr><th>Total Actual Cost</th><td>${formatCurrency(trip.total_actual_cost)}</td></tr>
            </table>
          </div>

        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

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
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50 p-4">
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
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded hover:bg-indigo-700"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripPrintModal;
