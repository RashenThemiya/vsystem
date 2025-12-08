import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";
import dayjs from "dayjs";

const DriverProfile = () => {
  const { driverId } = useParams();
  const [driver, setDriver] = useState(null);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [totalEarning, setTotalEarning] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDriver();
  }, [driverId]);

  useEffect(() => {
    if (driver) applyFilters();
  }, [driver, selectedYear, selectedMonth]);

  const fetchDriver = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/drivers/${driverId}`);
      setDriver(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch driver details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateEarning = (trips) => {
    const total = trips.reduce((sum, t) => {
      if (t.trip_status === "Completed") {
        if (t.driver_cost) return sum + Number(t.driver_cost);
        if (t.payment_amount) return sum + Number(t.payment_amount);
        if (t.total_actual_cost) return sum + Number(t.total_actual_cost);
      }
      return sum;
    }, 0);
    setTotalEarning(total);
  };

  const applyFilters = () => {
    if (!driver?.trips) return;

    let trips = [...driver.trips];

    if (selectedYear !== "all") {
      trips = trips.filter((t) => dayjs(t.created_at).format("YYYY") === selectedYear);
    }

    if (selectedMonth !== "all") {
      trips = trips.filter((t) => dayjs(t.created_at).format("MM") === selectedMonth);
    }

    setFilteredTrips(trips);
    calculateEarning(trips);
  };

  // Get unique years from trips
  const years = driver?.trips
    ? ["all", ...Array.from(new Set(driver.trips.map(t => dayjs(t.created_at).format("YYYY")))).sort((a,b)=>b-a)]
    : ["all"];

  // Months list
  const months = ["all", ...Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))];

  if (loading) return <p className="p-6">Loading driver...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!driver) return <p className="p-6">No driver found.</p>;

  return (
    <div className="p-6">
      {/* DRIVER HEADER */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex gap-6">
        <img
          src={driver.image || "/default-driver.png"}
          alt="Driver"
          className="w-32 h-32 rounded-lg object-cover border"
        />
        <div>
          <h2 className="text-2xl font-bold">{driver.name}</h2>
          <p><strong>Phone:</strong> {driver.phone_number || "-"}</p>
          <p><strong>NIC:</strong> {driver.nic || "-"}</p>
          <p><strong>Charges:</strong> Rs. {driver.driver_charges || "0"}</p>
          <p><strong>License No:</strong> {driver.license_number || "-"}</p>
          <p><strong>License Expiry:</strong>{" "}
            {driver.license_expiry_date ? dayjs(driver.license_expiry_date).format("YYYY-MM-DD") : "-"}
          </p>
        </div>
      </div>

      {/* YEAR & MONTH DROPDOWN */}
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

      {/* TOTAL EARNING */}
      <div className="bg-green-100 p-4 rounded-lg mb-4 text-lg font-semibold">
        Total Earnings (Completed Trips Only): Rs. {totalEarning.toLocaleString()}
      </div>

      {/* TRIPS TABLE */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {filteredTrips.length === 0 ? (
          <p className="p-4 text-center">No trips found for this selection.</p>
        ) : (
          <table className="w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Trip ID</th>
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Passengers</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Driver Cost</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map((t) => (
                <tr key={t.trip_id} className="border-b">
                  <td className="p-2 text-center">{t.trip_id}</td>
                  <td className="p-2">{t.from_location}</td>
                  <td className="p-2">{t.to_location}</td>
                  <td className="p-2 text-center">{t.num_passengers}</td>
                  <td className="p-2">{t.payment_amount || "-"}</td>
                  <td className="p-2">{t.driver_cost || "0"}</td>
                  <td className="p-2">{t.trip_status}</td>
                  <td className="p-2">{dayjs(t.created_at).format("YYYY-MM-DD")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DriverProfile;
