import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import ModalWrapper from "../../components/ModelWrapper";

import StatsCards from "../AdminDashboard/StatsCards";
import FuelEditModal from "../AdminDashboard/FuelEditModal";
import { useNavigate } from "react-router-dom";
import ExpiryNotificationPanel from "./ExpiryNotificationPanel";


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

const COLORS = [
  "#adaef7ff",
  "#6037c9ff",
  "#9f1eefff",
  "#f116acff",
  "#e887bfff",
];

const fuelColors = [
  "#312e81", // indigo
  "#4f46e5", // indigo
  "#7c3aed", // violet
  "#c084fc", // violet-pink
];

export default function DashboardKPIs() {
  const { name, role } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Trip Status Chart State
  const [viewType, setViewType] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Profit Chart State (separate)
  const [profitViewType, setProfitViewType] = useState("monthly");
  const [profitMonth, setProfitMonth] = useState("");
  const [profitYear, setProfitYear] = useState("");

  const [showFuelModal, setShowFuelModal] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState(null);
  const navigate = useNavigate();

  // Fetch KPIs
  const fetchKPIs = async () => {
    try {
      setLoading(true);
      const res = await api.get("api/dashboard/kpis");
      const data = res.data.data;

      if (data.fuelPrices && data.fuelPrices.length > 0) {
        data.fuelPrices = data.fuelPrices.map((fuel) => ({
          fuel_id: fuel.fuel_id,
          type: fuel.type,
          cost: fuel.cost,
        }));
      }

      setKpis(data);

      // Set default dropdowns
      if (data.monthlyTripStatusCounts.length > 0) {
        setSelectedMonth(data.monthlyTripStatusCounts[0].month);
        setProfitMonth(data.monthlyTripStatusCounts[0].month);
      }
      if (data.yearlyTripStatusCounts.length > 0) {
        setSelectedYear(data.yearlyTripStatusCounts[0].year);
        setProfitYear(data.yearlyTripStatusCounts[0].year);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard KPIs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, []);

  if (loading) return <div>Loading KPIs...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!kpis) return null;

  const chartData =
    viewType === "monthly"
      ? kpis.monthlyTripStatusCounts
          .filter((item) => item.month === selectedMonth)
          .map((item) => ({ name: item.trip_status, value: item.count }))
      : kpis.yearlyTripStatusCounts
          .filter((item) => item.year === Number(selectedYear))
          .map((item) => ({ name: item.trip_status, value: item.count }));

  const months = [...new Set(kpis.monthlyTripStatusCounts.map((item) => item.month))];
  const years = [...new Set(kpis.yearlyTripStatusCounts.map((item) => item.year))];

  const handleFuelClick = (data, index) => {
    const fuel = kpis.fuelPrices[index];
    setSelectedFuel(fuel);
    setShowFuelModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            
            {/* Left */}
            <div>
              <h1 className="text-2xl font-semibold">Dashboard KPIs</h1>
              <p className="text-sm text-gray-500">
                Overview of trips, vehicles, and fuel costs
              </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                Signed in as <span className="font-medium">{name}</span> — {role}
              </div>

              <ExpiryNotificationPanel />
            </div>
          </div>

          

          {/* Stats Cards */}
          <div className="mb-6">
            <StatsCards
              stats={kpis}
              onSelectTrips={() => navigate("/trip-dashboard")}
              onSelectVehicles={() => navigate("/vehicle-dashboard")}
              onSelectCustomers={() => navigate("/customer-dashboard")}
              onSelectOwners={() => navigate("/owner-dashboard")}
              onSelectPendingBills={() => navigate("/bill-dashboard")}
            />
          </div>

          {/* Trip Status Charts */}
          <div className="flex flex-col lg:flex-row gap-6 mb-5">
            {/* Trip Status Pie Chart */}
            <div className="bg-white p-4 rounded-lg shadow flex-1">
              <h3 className="text-lg font-semibold mb-2">Trip Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.keys(kpis.tripStatusCounts).map((key) => ({
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
            <div className="bg-white p-4 rounded-lg shadow flex-1">
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
                  <Bar dataKey="value" name="Trips">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit & Fuel Charts Row */}
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
{/* Trip Profit Chart */}
<div className="bg-white p-4 rounded-lg shadow flex-1">
  <div className="flex justify-between items-center mb-2">
    <h3 className="text-lg font-semibold">Trip Profit Overview</h3>
    <div className="flex gap-2">
      {/* Year Dropdown Only */}
      <select
        value={profitYear}
        onChange={(e) => setProfitYear(e.target.value)}
        className="border rounded p-1"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  </div>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={kpis.monthlyTripProfit.filter(
        (p) => p.month.startsWith(profitYear) // filter months for selected year
      )}
    >
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip formatter={(value) => `LKR ${value.toLocaleString()}`} />
      <Legend />
      <Bar dataKey="total_profit" name="Profit" fill="#7c3aed" />
    </BarChart>
  </ResponsiveContainer>
</div>


            {/* Fuel Prices Bar Chart */}
            <div className="bg-white p-4 rounded-lg shadow flex-1">
              <h3 className="text-lg font-semibold mb-2">Fuel Prices (Click bar to edit)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={kpis.fuelPrices} barCategoryGap={30}>
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip formatter={(value) => `LKR ${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="cost" name="Fuel Cost" barSize={100} onClick={handleFuelClick}>
                    {kpis.fuelPrices.map((_, index) => (
                      <Cell
                        key={`fuel-${index}`}
                        fill={fuelColors[index % fuelColors.length]}
                        cursor="pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fuel Edit Modal */}
          {showFuelModal && selectedFuel && (
            <ModalWrapper onClose={() => setShowFuelModal(false)}>
              <FuelEditModal
                open={showFuelModal}
                fuel={selectedFuel}
                onClose={() => setShowFuelModal(false)}
                onSuccess={fetchKPIs}
              />
            </ModalWrapper>
          )}
        </div>
      </main>
    </div>
  );
}
