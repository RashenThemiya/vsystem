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
import StartTripModal from "./TripAction/StartTripModal";
import EndTripModal from "./TripAction/EndTripModal";


export default function TripDashboard() {
  const { name, role } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [baseTrips, setBaseTrips] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  const [tripTypeFilter, setTripTypeFilter] = useState("ALL"); // "Daily", "Special", etc.
  const [companyFilter, setCompanyFilter] = useState("ALL");   // company_id or "ALL"

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

const applyBaseFilters = () => {
  let filtered = [...allTrips];

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

  // YEAR
  if (yearFilter !== "ALL") {
    filtered = filtered.filter(t => {
      const year = new Date(t.leaving_datetime).getFullYear();
      return year === Number(yearFilter);
    });
  }

  // MONTH
  if (monthFilter !== "ALL") {
    filtered = filtered.filter(t => {
      const month = new Date(t.leaving_datetime).getMonth() + 1;
      return month === Number(monthFilter);
    });
  }

  if (tripTypeFilter !== "ALL") {
    filtered = filtered.filter(t => t.trip_type === tripTypeFilter);
  }

  // COMPANY
  if (companyFilter !== "ALL") {
    filtered = filtered.filter(t => t.customer?.name === companyFilter);
  }

  return filtered;
};

  
  const applyFilters = () => {
  const baseFiltered = applyBaseFilters();

  // Status filter for table only
  let filtered = [...baseFiltered];
  if (statusFilter !== "ALL") {
    filtered = filtered.filter(t => t.trip_status === statusFilter);
  }

  setFilteredTrips(filtered);
  setBaseTrips(baseFiltered);   // IMPORTANT: used for stats
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
}, [statusFilter, searchQuery, monthFilter, yearFilter, tripTypeFilter, companyFilter, allTrips]);

  const stats = {
   total: baseTrips.length,
    pending: baseTrips.filter(t => t.trip_status === "Pending").length,
    ongoing: baseTrips.filter(t => t.trip_status === "Ongoing").length,
    ended: baseTrips.filter(t => t.trip_status === "Ended").length,
    completed: baseTrips.filter(t => t.trip_status === "Completed").length,
    cancelled: baseTrips.filter(t => t.trip_status === "Cancelled").length,
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

            <select
                value={tripTypeFilter}
                onChange={e => setTripTypeFilter(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="ALL">All Trip Types</option>
                <option value="Daily">Daily</option>
                <option value="Special">Special</option>
              </select>

              {/* Company Filter */}
              <select
                  value={companyFilter}
                  onChange={e => setCompanyFilter(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="ALL">All Customers</option>
                  {allTrips
                    .map(t => t.customer?.name)           // use customer name
                    .filter((v, i, a) => v && a.indexOf(v) === i) // unique customer names
                    .map((customerName) => (
                      <option key={customerName} value={customerName}>
                        {customerName}
                      </option>
                    ))}
                </select>

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
      <StartTripModal
          open={showStartModal}
          tripId={selectedTripId}
          onClose={() => setShowStartModal(false)}
          onSuccess={() => {
            fetchTrips();   // refresh dashboard
          }}
        />
        <EndTripModal
          open={showEndModal}
          tripId={selectedTripId}
          currentMeter={endMeter}
          onClose={() => setShowEndModal(false)}
          onSuccess={() => {
            fetchTrips(); // refresh list
          }}
        />

    </div>
  );
}
