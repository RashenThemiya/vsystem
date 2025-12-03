import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axiosInstance";

const TripView = () => {
  const navigate = useNavigate();
  const { name, role } = useAuth();
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending"); 
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  // Modal state
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [startMeter, setStartMeter] = useState(null);
  const [endMeter, setEndMeter] = useState(null);

  const tripStatuses = ["Pending", "Ongoing", "Ended", "Completed", "Cancelled"];

  const fetchTrips = async () => {
    setLoading(true);
    try {
      let query = `?start_date=${yearFilter}-${monthFilter
        .toString()
        .padStart(2, "0")}-01&end_date=${yearFilter}-${monthFilter
        .toString()
        .padStart(2, "0")}-31`;
      if (statusFilter) query += `&trip_status=${statusFilter}`;

      const response = await api.get(`/api/trips${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const tripData = Array.isArray(response.data.data) ? response.data.data : [];
      setTrips(tripData);
      setFilteredTrips(tripData);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch trips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = trips.filter((trip) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        trip.from_location.toLowerCase().includes(searchLower) ||
        trip.to_location.toLowerCase().includes(searchLower) ||
        trip.customer.name.toLowerCase().includes(searchLower)
      );
    });
    setFilteredTrips(filtered);
  }, [searchQuery, trips]);

  useEffect(() => {
    fetchTrips();
  }, [statusFilter, monthFilter, yearFilter]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // ----------------- Start Trip -----------------
  const openStartTripModal = (tripId) => {
    setSelectedTripId(tripId);
    setStartMeter(null);
    setShowStartModal(true);
  };

  const handleStartTrip = async () => {
    if (!selectedTripId || startMeter === null || isNaN(startMeter)) {
      alert("Please enter a valid meter number");
      return;
    }

    try {
      await api.patch(
        `/api/trips/${selectedTripId}/start`,
        { start_meter: startMeter },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Trip started successfully!");
      setShowStartModal(false);
      fetchTrips();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to start trip.");
    }
  };

  // ----------------- End Trip -----------------
  const openEndTripModal = (tripId, currentMeter) => {
    setSelectedTripId(tripId);
    setEndMeter(currentMeter || null);
    setShowEndModal(true);
  };

  const handleEndTrip = async () => {
    if (!selectedTripId || endMeter === null || isNaN(endMeter)) {
      alert("Please enter a valid meter number");
      return;
    }

    try {
      await api.patch(
        `/api/trips/${selectedTripId}/end`,
        { end_meter: endMeter },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Trip ended successfully!");
      setShowEndModal(false);
      fetchTrips();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to end trip.");
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 py-10">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-7xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6">View Trips</h2>

        {/* Status Navbar */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {tripStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded font-medium transition ${
                statusFilter === status
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Month/Year Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-4">
          <select
            className="border rounded px-3 py-2"
            value={monthFilter}
            onChange={(e) => setMonthFilter(parseInt(e.target.value))}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="border rounded px-3 py-2 w-24"
            value={yearFilter}
            onChange={(e) => setYearFilter(parseInt(e.target.value))}
          />
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search by From, To, or Customer..."
            className="border rounded px-3 py-2 w-full max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Error / Loading */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            ❌ {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500">Loading trips...</div>
        ) : filteredTrips.length === 0 ? (
          <div className="text-center text-gray-600">No trips found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border rounded-lg">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">From</th>
                  <th className="px-4 py-3 text-left">To</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Vehicle</th>
                  <th className="px-4 py-3 text-left">Driver</th>
                  <th className="px-4 py-3 text-left">Trip Status</th>
                  <th className="px-4 py-3 text-left">Payment Status</th>
                  <th className="px-4 py-3 text-left">Leaving Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {filteredTrips.map((trip) => (
                  <tr key={trip.trip_id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-4">
                            <button
                        onClick={() => navigate(`/trip/${trip.trip_id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        {trip.trip_id}
                      </button>
                    </td>

                    <td className="px-4 py-4">{trip.from_location}</td>
                    <td className="px-4 py-4">{trip.to_location}</td>
                    <td className="px-4 py-4">{trip.customer.name}</td>
                    <td className="px-4 py-4">{trip.vehicle.name}</td>
                    <td className="px-4 py-4">{trip.driver?.name || "N/A"}</td>
                    <td className="px-4 py-4">{trip.trip_status}</td>
                    <td className="px-4 py-4">{trip.payment_status}</td>
                    <td className="px-4 py-4">{new Date(trip.leaving_datetime).toLocaleString()}</td>
                    <td className="px-4 py-4 flex gap-2">
                      <button
                        onClick={() => navigate(`/trip/${trip.trip_id}`)}
                        className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                      >
                        View
                      </button>

                      {trip.trip_status === "Pending" && (
                        <button
                          onClick={() => openStartTripModal(trip.trip_id)}
                          className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition"
                        >
                          Start
                        </button>
                      )}

                      {trip.trip_status === "Ongoing" && (
                        <button
                          onClick={() => openEndTripModal(trip.trip_id, trip.vehicle.meter_number)}
                          className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition"
                        >
                          End
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Start Trip Modal */}
        {showStartModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-xl w-80">
              <h3 className="text-xl font-bold mb-4">Start Trip</h3>
              <input
                type="number"
                placeholder="Enter start meter"
                className="border rounded px-3 py-2 w-full mb-4"
                value={startMeter ?? ""}
                onChange={(e) => setStartMeter(Number(e.target.value))}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowStartModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartTrip}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* End Trip Modal */}
        {showEndModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-xl w-80">
              <h3 className="text-xl font-bold mb-4">End Trip</h3>
              <input
                type="number"
                placeholder="Enter end meter"
                className="border rounded px-3 py-2 w-full mb-4"
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
    </div>
  );
};

export default TripView;
