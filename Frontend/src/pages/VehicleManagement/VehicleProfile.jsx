import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";
import dayjs from "dayjs";

import Sidebar from "./VehicleProfileComponent/Sidebar";
import TripsTab from "./VehicleProfileComponent/TripsTab";
import CostsTab from "./VehicleProfileComponent/CostsTab";
import { PlusCircle } from "react-feather";


const VehicleProfile = () => {
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("trips");

  // Trips state
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [totalEarning, setTotalEarning] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");
  const [tripDateFilterType, setTripDateFilterType] = useState("all");
  const [tripSelectedMonth, setTripSelectedMonth] = useState("");
  const [tripSelectedYear, setTripSelectedYear] = useState("");

  // Costs state
  const [filteredCosts, setFilteredCosts] = useState([]);
  const [costDateFilterType, setCostDateFilterType] = useState("all");
  const [costSelectedMonth, setCostSelectedMonth] = useState("");
  const [costSelectedYear, setCostSelectedYear] = useState("");

  
  useEffect(() => {
    fetchVehicle();
  }, [id]);

  useEffect(() => {
    if (vehicle) {
      applyTripFilter();
      applyCostFilter();
    }
  }, [
    vehicle,
    filterStatus,
    tripDateFilterType,
    tripSelectedMonth,
    tripSelectedYear,
    costDateFilterType,
    costSelectedMonth,
    costSelectedYear,
  ]);

  // Fetch vehicle details
  const fetchVehicle = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/vehicles/${id}`);
      setVehicle(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch vehicle details.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate earnings
  const calculateEarnings = (trips) => {
    const total = trips
      .filter((t) => t.trip_status === "Completed")
      .reduce((sum, t) => sum + Number(t.payment_amount || 0), 0);
    setTotalEarning(total);
  };

  // Filter trips
  const applyTripFilter = () => {
    if (!vehicle?.trips) return;

    let trips = [...vehicle.trips];

    if (filterStatus !== "all") {
      trips = trips.filter((t) => t.trip_status === filterStatus);
    }

    if (tripDateFilterType === "month" && tripSelectedMonth) {
      trips = trips.filter(
        (t) => dayjs(t.created_at).format("YYYY-MM") === tripSelectedMonth
      );
    }

    if (tripDateFilterType === "year" && tripSelectedYear) {
      trips = trips.filter(
        (t) => dayjs(t.created_at).format("YYYY") === tripSelectedYear
      );
    }

    setFilteredTrips(trips);
    calculateEarnings(trips);
  };

  // Filter costs
  const applyCostFilter = () => {
    if (!vehicle?.vehicle_other_costs) return;

    let costs = [...vehicle.vehicle_other_costs];

    if (costDateFilterType === "month" && costSelectedMonth) {
      costs = costs.filter(
        (c) => c.date && dayjs(c.date).format("YYYY-MM") === costSelectedMonth
      );
    } else if (costDateFilterType === "year" && costSelectedYear) {
      costs = costs.filter(
        (c) => c.date && dayjs(c.date).year() === Number(costSelectedYear)
      );
    }

    setFilteredCosts(costs);
  };

  // Open image in new tab
  const openImage = (img) => {
    if (!img) return;
    const win = window.open();
    win.document.write(`<img src="${img}" style="width:100%" />`);
  };

  if (loading) return <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-3">
      <div className="animate-spin h-8 w-8 rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      <p className="text-sm font-semibold text-gray-700">
        Loading vehicle details...
      </p>
    </div>
  </div>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!vehicle) return <p className="p-6">No vehicle found.</p>;

  return (
    <div className="flex h-screen p-6 gap-6">
      <Sidebar
        vehicle={vehicle}
        openImage={openImage}
        refreshVehicle={fetchVehicle}
      />

      <div className="flex-1 space-y-6 overflow-y-auto">
        {/* Tabs */}
        <div className="flex gap-3 border-b pb-2">
          <button
            onClick={() => setFilter("trips")}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg ${
              filter === "trips"
                ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow"
                : "bg-gray-200 text-gray-800 hover:bg-purple-400 hover:text-white"
            }`}
          >
            Trips
          </button>
          <button
            onClick={() => setFilter("costs")}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg ${
              filter === "costs"
                ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow"
                : "bg-gray-200 text-gray-800 hover:bg-purple-400 hover:text-white"
            }`}
          >
            Other Costs
          </button>
        </div>

        {/* Trips Tab */}
        {filter === "trips" && (
          <TripsTab
            trips={filteredTrips}
            totalEarning={totalEarning}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            tripDateFilterType={tripDateFilterType}
            setTripDateFilterType={setTripDateFilterType}
            tripSelectedMonth={tripSelectedMonth}
            setTripSelectedMonth={setTripSelectedMonth}
            tripSelectedYear={tripSelectedYear}
            setTripSelectedYear={setTripSelectedYear}
          />
        )}

        {/* Costs Tab */}
        {/* Costs Tab */}
{filter === "costs" && (
  <div className="space-y-4">
    


    {/* Costs Table */}
    <CostsTab
      costs={filteredCosts}
      vehicleId={vehicle.vehicle_id}
      costDateFilterType={costDateFilterType}
      setCostDateFilterType={setCostDateFilterType}
      costSelectedMonth={costSelectedMonth}
      setCostSelectedMonth={setCostSelectedMonth}
      costSelectedYear={costSelectedYear}
      setCostSelectedYear={setCostSelectedYear}
      refreshVehicle={fetchVehicle}
    />
  </div>
)}

      </div>
    </div>
  );
};

export default VehicleProfile;
