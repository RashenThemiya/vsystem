import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
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

// Blue and Pink palette
const COLORS = ["#3B82F6", "#EC4899", "#93C5FD"]; // Blue, Pink, Light Blue

const KpiDashboard = ({ customerID, customerName }) => {
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchKpi = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/api/customers/${customerID}/kpi`);
      setKpi(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load KPI data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerID) fetchKpi();
  }, [customerID]);

  if (loading) return <div className="p-6">Loading KPIs...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!kpi) return <div className="p-6">No KPI data available</div>;

  const pieData = [
    { name: "Paid", value: kpi.pieChart?.Paid || 0 },
    { name: "Partially Paid", value: kpi.pieChart?.Partially_Paid || 0 },
    { name: "Unpaid", value: kpi.pieChart?.Unpaid || 0 },
  ];

  const barData = [
    { name: "Pending", count: kpi.barChart?.Pending || 0 },
    { name: "Ongoing", count: kpi.barChart?.Ongoing || 0 },
    { name: "Ended", count: kpi.barChart?.Ended || 0 },
    { name: "Completed", count: kpi.barChart?.Completed || 0 },
    { name: "Cancelled", count: kpi.barChart?.Cancelled || 0 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 min-h-screen">
      {/* KPI Content */}
      <div className="flex-1 space-y-6">
        {/* Welcome Message */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome,{" "}
            <span className="text-violet-700">
              {customerName || "Valued Customer"}
            </span>
            !
          </h2>
          <p className="text-gray-500 mt-2">
            We are thrilled to have you at Ceylon Places. Here's a quick
            overview of your activity and KPIs.
          </p>
          <p className="text-gray-500 mt-2 italic">
            Planning a trip? Call us now! Our team is ready to make your journey
            smooth and memorable.
          </p>
        </div>

        {/* KPI Charts */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Payment Status Pie Chart */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow h-72 md:h-64">
            <h3 className="text-md font-semibold mb-1 text-gray-700">
              Your Payment Status
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              Overview of your paid, partially paid, and unpaid payments.
            </p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Trip Status Bar Chart */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow h-72 md:h-64">
            <h3 className="text-md font-semibold mb-1 text-gray-700">
              Your Trip Summary
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              Track your trips by status: pending, ongoing, ended, completed, or
              cancelled.
            </p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" /> {/* Blue bar */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiDashboard;
