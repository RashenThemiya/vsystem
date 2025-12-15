import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import ModalWrapper from "../components/ModelWrapper";

import StatsCards from "./StatsCards";
import FuelEditModal from "./FuelEditModal";

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



export default function DashboardKPIs() {
  const { name, role } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [showFuelModal, setShowFuelModal] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState(null);

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
      if (data.monthlyTripStatusCounts.length > 0)
        setSelectedMonth(data.monthlyTripStatusCounts[0].month);
      if (data.yearlyTripStatusCounts.length > 0)
        setSelectedYear(data.yearlyTripStatusCounts[0].year);
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
            <div>
              <h1 className="text-2xl font-semibold">Dashboard KPIs</h1>
              <p className="text-sm text-gray-500">Overview of trips, vehicles, and fuel costs</p>
            </div>
            <div className="text-sm text-gray-600">
              Signed in as <span className="font-medium">{name}</span> — {role}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-6">
            <StatsCards stats={kpis} onStatusSelect={(status) => console.log("Filter:", status)} />
          </div>

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
                <Bar dataKey="value" name="Trips" fill="#7700feff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


          

          {/* Fuel Prices Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Fuel Prices (Click bar to edit)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={kpis.fuelPrices}>
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="cost"
                  name="Fuel Cost"
                  fill="#9910c6ff"
                  onClick={handleFuelClick}
                >
                  {kpis.fuelPrices.map((_, index) => (
                    <Cell key={`fuel-${index}`} cursor="pointer" />
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
      </main>

      
    </div>
  );
}
