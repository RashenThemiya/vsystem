// TripDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

import ActionCards from "./TripDashboardCompnent/ActionCards";
import StatsCards from "./TripDashboardCompnent/StatsCards";
import TripSearchBar from "./TripDashboardCompnent/SearchBar";
import TripTable from "./TripDashboardCompnent/TripTable";

export default function TripDashboard() {
  const { name, role } = useAuth();
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */

  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [monthFilter, setMonthFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");

  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  const [selectedTripId, setSelectedTripId] = useState(null);
  const [startMeter, setStartMeter] = useState(null);
  const [endMeter, setEndMeter] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /* ---------------- FETCH TRIPS ---------------- */

  const fetchTrips = async () => {
  setLoading(true);
  try {
    const res = await api.get(`/api/trips`);
    const data = Array.isArray(res.data.data) ? res.data.data : [];
    setAllTrips(data);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch trips");
  } finally {
    setLoading(false);
  }
};



  /* ---------------- APPLY FILTERS ---------------- */

  const applyFilters = () => {
  let filtered = [...allTrips];

  // STATUS
  if (statusFilter !== "ALL") {
    filtered = filtered.filter(t => t.trip_status === statusFilter);
  }

  // SEARCH
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(t =>
      t.from_location?.toLowerCase().includes(q) ||
      t.to_location?.toLowerCase().includes(q) ||
      t.customer?.name?.toLowerCase().includes(q) ||
      t.driver?.name?.toLowerCase().includes(q)
    );
  }

  // YEAR (created_at)
  if (yearFilter !== "ALL") {
    filtered = filtered.filter(t => {
      const year = new Date(t.created_at).getFullYear();
      return year === Number(yearFilter);
    });
  }

  // MONTH (created_at)
  if (monthFilter !== "ALL") {
    filtered = filtered.filter(t => {
      const month = new Date(t.created_at).getMonth() + 1;
      return month === Number(monthFilter);
    });
  }

  setFilteredTrips(filtered);
};



  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  /* ---------------- EFFECTS ---------------- */

  // Fetch when month/year changes
  useEffect(() => {
  fetchTrips();
}, []);


  // Filter when data or filters change
  useEffect(() => {
  applyFilters();
}, [statusFilter, searchQuery, monthFilter, yearFilter, allTrips]);


  /* ---------------- STATS ---------------- */

  const stats = {
  total: filteredTrips.length,
  pending: filteredTrips.filter(t => t.trip_status === "Pending").length,
  ongoing: filteredTrips.filter(t => t.trip_status === "Ongoing").length,
  ended: filteredTrips.filter(t => t.trip_status === "Ended").length,
  completed: filteredTrips.filter(t => t.trip_status === "Completed").length,
  cancelled: filteredTrips.filter(t => t.trip_status === "Cancelled").length,
};


  /* ---------------- TRIP ACTIONS ---------------- */

  const openStartTripModal = (tripId) => {
    setSelectedTripId(tripId);
    setStartMeter(null);
    setShowStartModal(true);
  };

  const handleStartTrip = async () => {
    if (!startMeter || isNaN(startMeter)) return alert("Invalid meter");

    await api.patch(`/api/trips/${selectedTripId}/start`, { start_meter: startMeter });
    setShowStartModal(false);
    fetchTrips();
    setSuccessMessage("Trip started");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const openEndTripModal = (tripId, meter) => {
    setSelectedTripId(tripId);
    setEndMeter(meter || null);
    setShowEndModal(true);
  };

  const handleEndTrip = async () => {
    if (!endMeter || isNaN(endMeter)) return alert("Invalid meter");

    await api.patch(`/api/trips/${selectedTripId}/end`, { end_meter: endMeter });
    setShowEndModal(false);
    fetchTrips();
    setSuccessMessage("Trip ended");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Trip Management</h1>
              <p className="text-gray-500 text-sm">Manage all trips</p>
            </div>
            <div className="text-sm text-gray-600">
              {name} — {role}
            </div>
          </div>

          {/* Alerts */}
          {successMessage && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
              ✅ {successMessage}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <StatsCards onStatusSelect={setStatusFilter} stats={stats} />
            </div>
            <div className="lg:col-span-1">
              <ActionCards onAddTripClick={() => navigate("/create-trip")} />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mt-6 items-center">
            <TripSearchBar onSearch={setSearchQuery} />
          </div>

          <div className="flex gap-4 mt-2 items-center">
            <select
              value={monthFilter}
              onChange={e => setMonthFilter(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="ALL">All Months</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="ALL">All Years</option>
              {years.map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

          </div>

          {/* Table */}
          <div className="mt-4">
            <TripTable
              trips={filteredTrips}
              loading={loading}
              error={error}
              onSelectTrip={(t) => navigate(`/trip/${t.trip_id}`)}
              onStartTrip={openStartTripModal}
              onEndTrip={openEndTripModal}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
