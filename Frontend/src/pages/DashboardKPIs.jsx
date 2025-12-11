import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { FaCar, FaUser, FaUsers, FaMoneyBillWave, FaClipboardList } from "react-icons/fa";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

const DashboardKPIs = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("monthly"); // monthly or yearly
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const res = await api.get("api/dashboard/kpis");
        const data = res.data.data;
        setKpis(data);

        // Set default selected month/year
        if (data.monthlyTripStatusCounts.length > 0) {
          setSelectedMonth(data.monthlyTripStatusCounts[0].month);
        }
        if (data.yearlyTripStatusCounts.length > 0) {
          setSelectedYear(data.yearlyTripStatusCounts[0].year);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard KPIs.");
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  if (loading) return <div>Loading KPIs...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!kpis) return null;

  // KPI Cards
  const kpiCards = [
    { label: "Total Trips", value: kpis.totalTrips, icon: <FaClipboardList /> },
    { label: "Total Vehicles", value: kpis.totalVehicles, icon: <FaCar /> },
    { label: "Total Customers", value: kpis.totalCustomers, icon: <FaUsers /> },
    { label: "Total Owners", value: kpis.totalOwners, icon: <FaUser /> },
    { label: "Pending Bills", value: kpis.pendingBillsCount, icon: <FaMoneyBillWave /> },
  ];

  // Filter data based on selected month/year
  const chartData =
    viewType === "monthly"
      ? kpis.monthlyTripStatusCounts
          .filter((item) => item.month === selectedMonth)
          .map((item) => ({ name: item.trip_status, value: item.count }))
      : kpis.yearlyTripStatusCounts
          .filter((item) => item.year === Number(selectedYear))
          .map((item) => ({ name: item.trip_status, value: item.count }));

  // Get unique months and years for dropdown
  const months = [...new Set(kpis.monthlyTripStatusCounts.map((item) => item.month))];
  const years = [...new Set(kpis.yearlyTripStatusCounts.map((item) => item.year))];

  return (
    <div className="p-4 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <div className="text-3xl text-green-600">{kpi.icon}</div>
            <div>
              <div className="text-gray-500">{kpi.label}</div>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Trip Status Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Trip Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={Object.keys(kpis.tripStatusCounts).map((key, i) => ({
                name: key,
                value: kpis.tripStatusCounts[key],
              }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {Object.keys(kpis.tripStatusCounts).map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly/Yearly Trip Status Bar Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Trip Status Overview</h3>
          <div className="flex gap-2">
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              className="border rounded p-1"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            {viewType === "monthly" && (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border rounded p-1"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            )}

            {viewType === "yearly" && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border rounded p-1"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Trips" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Fuel Prices Bar Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Fuel Prices</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={kpis.fuelPrices}>
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cost" name="Fuel Cost" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardKPIs;
