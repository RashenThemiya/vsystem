import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";
import dayjs from "dayjs";

const CustomerProfile = () => {
  const { customerId } = useParams();

  const [customer, setCustomer] = useState(null);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [totalPayment, setTotalPayment] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  useEffect(() => {
    if (customer) applyFilters();
  }, [customer, selectedYear, selectedMonth]);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/api/customers/${customerId}`);
      setCustomer(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch customer details.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPayment = (trips) => {
    const total = trips.reduce((sum, t) => sum + Number(t.payment_amount || 0), 0);
    setTotalPayment(total);
  };

  const applyFilters = () => {
    if (!customer?.trips) return;

    let trips = [...customer.trips];

    if (selectedYear !== "all") {
      trips = trips.filter((t) => dayjs(t.created_at).format("YYYY") === selectedYear);
    }

    if (selectedMonth !== "all") {
      trips = trips.filter((t) => dayjs(t.created_at).format("MM") === selectedMonth);
    }

    setFilteredTrips(trips);
    calculateTotalPayment(trips);
  };

  const years = customer?.trips
    ? ["all", ...Array.from(new Set(customer.trips.map((t) => dayjs(t.created_at).format("YYYY")))).sort((a, b) => b - a)]
    : ["all"];

  const months = ["all", ...Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))];

  if (loading) return <p className="p-6">Loading customer...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!customer) return <p className="p-6">No customer found.</p>;

  return (
    <div className="p-6">

      {/* CUSTOMER HEADER */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <div className="flex gap-6">

          {/* NIC PHOTOS */}
          <div className="flex flex-col gap-3">
            <img
              src={customer.nic_photo_front || "/nic-front-placeholder.png"}
              alt="NIC Front"
              className="w-40 h-28 rounded-lg object-cover border shadow"
            />

            <img
              src={customer.nic_photo_back || "/nic-back-placeholder.png"}
              alt="NIC Back"
              className="w-40 h-28 rounded-lg object-cover border shadow"
            />
          </div>

          {/* PERSONAL DETAILS */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">{customer.name}</h2>

            <div className="grid grid-cols-2 gap-3 text-gray-700">
              <p><strong>Phone:</strong> {customer.phone_number || "-"}</p>
              <p><strong>NIC Number:</strong> {customer.nic || "-"}</p>
              <p><strong>Email:</strong> {customer.email || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 mb-4 items-center">
        <div>
          <label className="mr-2 font-semibold">Year:</label>
          <select
            className="border p-2 rounded"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y === "all" ? "All Years" : y}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">Month:</label>
          <select
            className="border p-2 rounded"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m === "all" ? "All Months" : dayjs(`2025-${m}-01`).format("MMMM")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TOTAL PAYMENT */}
      <div className="bg-blue-100 p-4 rounded-lg mb-4 text-lg font-semibold">
        Total Payment (Filtered Trips): Rs. {totalPayment.toLocaleString()}
      </div>

      {/* TRIPS TABLE */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {filteredTrips.length === 0 ? (
          <p className="p-4 text-center">No trips found for this filter.</p>
        ) : (
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Trip ID</th>
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Passengers</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Status</th>
                <th className="p-2">Distance</th>
                <th className="p-2">Days</th>
                <th className="p-2">Driver</th>
                <th className="p-2">Fuel</th>
                 <th className="p-2">Costs</th>
                <th className="p-2">Created</th>
               
                 <th className="p-2">Route</th>
                 <th className="p-2">Status </th>

              </tr>
            </thead>

          <tbody>
  {filteredTrips.map((t) => (
    <tr key={t.trip_id} className="border-b">
      <td className="p-2 text-center">{t.trip_id}</td>
      <td className="p-2">{t.from_location}</td>
      <td className="p-2">{t.to_location}</td>
      <td className="p-2 text-center">{t.num_passengers}</td>
      <td className="p-2">Rs. {t.payment_amount || "-"}</td>
      <td className="p-2">{t.trip_status}</td>

      {/* Distance & Days */}
      <td className="p-2">
        Est: {t.estimated_distance || "-"} km<br />
        Actual: {t.actual_distance || "-"} km
      </td>
      <td className="p-2">
        Est: {t.estimated_days || "-"} days<br />
        Actual: {t.actual_days || "-"} days
      </td>

      {/* Driver & Fuel */}
      <td className="p-2">{t.driver_required} (ID {t.driver_id || "-"})</td>
      <td className="p-2">{t.fuel_required}</td>

      {/* Costs */}
      <td className="p-2">
        Estimated: Rs. {t.total_estimated_cost?.toLocaleString() || "-"}<br />
        Actual: Rs. {t.total_actual_cost?.toLocaleString() || "-"}<br />

      </td>

      {/* Created */}
      <td className="p-2">{dayjs(t.created_at).format("YYYY-MM-DD")}</td>

      {/* Route */}
      <td className="p-2">
        {t.map?.length > 0 ? (
          <ol className="list-decimal list-inside">
            {t.map.map((m) => (
              <li key={m.map_id}>
                {m.location_name} ({m.latitude}, {m.longitude})
              </li>
            ))}
          </ol>
        ) : "-"}
      </td>
        {/* Status */}
      <td className="p-2">{t.trip_status}</td>

    </tr>
  ))}
</tbody>


          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
