// TripDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import ActionCards from "./TripDashboardCompnent/ActionCards";
import StatsCards from "./TripDashboardCompnent/StatsCards";
import TripSearchBar from "./TripDashboardCompnent//SearchBar";
import TripTable from "./TripDashboardCompnent/TripTable";

export default function TripDashboard() {
  const { name, role } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [allTrips, setAllTrips] = useState([]);


  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [startMeter, setStartMeter] = useState(null);
  const [endMeter, setEndMeter] = useState(null);
 



  const tripStatuses = ["Pending", "Ongoing", "Ended", "Completed", "Cancelled"];
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const startDate = `${yearFilter}-${monthFilter.toString().padStart(2,"0")}-01`;
      const endDate = `${yearFilter}-${monthFilter.toString().padStart(2,"0")}-31`;
      let query = `?start_date=${startDate}&end_date=${endDate}`;

      //if (statusFilter) query += `&trip_status=${statusFilter}`;

      const response = await api.get(`/api/trips${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const tripData = Array.isArray(response.data.data) ? response.data.data : [];
      
      setTrips(tripData);
      setAllTrips(tripData);
      applyFilters(tripData); 
      setFilteredTrips(tripData);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch trips.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data) => {
  let filtered = data;

  if (statusFilter) {
    filtered = filtered.filter(t => t.trip_status === statusFilter);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(t =>
      t.from_location.toLowerCase().includes(q) ||
      t.to_location.toLowerCase().includes(q) ||
      t.customer.name.toLowerCase().includes(q)||
      t.driver.name.toLowerCase().includes(q)
    );
  }

  setTrips(filtered);
  setFilteredTrips(filtered);
};


  useEffect(() => {
    applyFilters(allTrips);
    fetchTrips();
  }, [statusFilter, monthFilter, yearFilter]);

  useEffect(() => {
    const filtered = trips.filter((trip) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        trip.from_location?.toLowerCase().includes(searchLower) ||
        trip.to_location?.toLowerCase().includes(searchLower) ||
        trip.customer?.name?.toLowerCase().includes(searchLower)||
        trip.driver?.name?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredTrips(filtered);
  }, [searchQuery, trips]);

  const stats = {
    total: allTrips.length,
    pending: allTrips.filter((t) => t.trip_status === "Pending").length,
    ongoing: allTrips.filter((t) => t.trip_status === "Ongoing").length,
    ended: allTrips.filter((t) => t.trip_status === "Ended").length,
    completed: allTrips.filter((t) => t.trip_status === "Completed").length,
    cancelled: allTrips.filter((t) => t.trip_status === "Cancelled").length,
  };

  const openStartTripModal = (tripId) => {
    setSelectedTripId(tripId);
    setStartMeter(null);
    setShowStartModal(true);
  };

  const handleStartTrip = async () => {
    if (!selectedTripId || startMeter === null || isNaN(startMeter)) {
      alert("Enter valid start meter");
      return;
    }
    await api.patch(`/api/trips/${selectedTripId}/start`, { start_meter: startMeter }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    setShowStartModal(false);
    fetchTrips();
    setSuccessMessage("Trip started!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const openEndTripModal = (tripId, currentMeter) => {
    setSelectedTripId(tripId);
    setEndMeter(currentMeter || null);
    setShowEndModal(true);
  };

  const handleEndTrip = async () => {
    if (!selectedTripId || endMeter === null || isNaN(endMeter)) {
      alert("Enter valid end meter");
      return;
    }
    await api.patch(`/api/trips/${selectedTripId}/end`, { end_meter: endMeter }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    setShowEndModal(false);
    fetchTrips();
    setSuccessMessage("Trip Ended!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Trip Management</h1>
              <p className="text-sm text-gray-500">Manage Trips and all Trip-related data</p>
            </div>
            <div className="text-sm text-gray-600">
              Signed in as <span className="font-medium">{name}</span> — {role}
              {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
                ❌ {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-200 border border-green-400 font-semibold text-green-700 px-4 py-3 rounded mb-4 text-center">
                ✅ {successMessage}
              </div>
            )}
            </div>
          </div>

          {/* Stats + Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6 items-stretch">
            <div className="lg:col-span-3"><StatsCards stats={stats} onStatusSelect={(status) => setStatusFilter(status)} /></div>
            <div className="lg:col-span-1"><ActionCards onAddTripClick={() => navigate("/create-trip")} /></div>
          </div>

          {/* Search + Month/Year Filter */}
          <div className="flex flex-wrap gap-4 mt-6 items-center">
            <TripSearchBar onSearch={setSearchQuery} />
            <label>Month:</label>
            <select value={monthFilter} onChange={(e) => setMonthFilter(Number(e.target.value))} className="w-30 border rounded-xl px-3 py-2 items-center border-gray-300">
              {[...Array(12)].map((_, i) => <option key={i+1} value={i+1} className="rounded-xl bg-gray-100 text-gray-800">{new Date(0,i).toLocaleString("default",{month:"long"})}</option>)}
            </select>
            <label>Year:</label>
            <input type="number" value={yearFilter} onChange={(e) => setYearFilter(Number(e.target.value))} className="w-25 border rounded-xl px-3 py-2 items-center w-24 border-gray-300"/>
          </div>

          {/* Table */}
          <div className="mt-8">
            <TripTable
              trips={filteredTrips}
              loading={loading}
              error={error}
              onSelectTrip={(trip) => navigate(`/trip/${trip.trip_id}`)}
              onSelectDriver={(trip) => {
                if (trip.driver?.driver_id) {
                  navigate(`/driver-profile/${trip.driver?.driver_id}`);
                }
              }}
              onSelectVehicle={(trip) => navigate(`/vehicles/${trip.vehicle?.vehicle_id}`)}
              onSelectCustomer={(trip) => navigate(`/customer-profile/${trip.customer?.customer_id}`)}
              onStartTrip={openStartTripModal}
              onEndTrip={openEndTripModal}
                onCreateAnotherTrip={(trip) =>
                        navigate("/create-trip", {
                          state: { copyTrip: trip },
                        })
}

            />
          </div>
        </div>
      </main>
      {/* Start Trip Modal */}
        {showStartModal && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-80">
              <h3 className="text-xl font-bold mb-4">Start Trip</h3>
              <input
                type="number"
                placeholder="Enter start meter"
                className="border rounded px-3 py-2 w-full mb-4 border-gray-300"
                value={startMeter ?? ""}
                onChange={(e) => setStartMeter(Number(e.target.value))}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowStartModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartTrip}
                  className="px-4 py-2 bg-green-600 text-white hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {/* End Trip Modal */}
        {showEndModal && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-xl w-80">
              <h3 className="text-xl font-bold mb-4">End Trip</h3>
              <input
                type="number"
                placeholder="Enter end meter"
                className="border rounded px-3 py-2 w-full mb-4 border-gray-300"
                value={endMeter ?? ""}
                onChange={(e) => setEndMeter(Number(e.target.value))}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEndModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEndTrip}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
