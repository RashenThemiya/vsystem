import dayjs from "dayjs";
import StatsCards from "../StatsCards";
import { useNavigate } from "react-router-dom";

const TripsTab = ({
  trips,
  totalEarning,
  filterStatus,
  setFilterStatus,
  tripDateFilterType,
  setTripDateFilterType,
  tripSelectedMonth,
  setTripSelectedMonth,
  tripSelectedYear,
  setTripSelectedYear,
}) => {
  const statusOptions = ["all", "Pending", "Ongoing", "Ended", "Completed", "Cancelled"];
  
  const navigate = useNavigate();

  const filteredTripsCount =
  filterStatus === "all"
    ? trips.length
    : trips.filter((t) => t.trip_status === filterStatus).length;

  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <label className="text-sm font-semibold">Filter Trips by:</label>
        <select
          value={tripDateFilterType}
          onChange={(e) => {
            setTripDateFilterType(e.target.value);
            setTripSelectedMonth("");
            setTripSelectedYear("");
          }}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>

        {tripDateFilterType === "month" && (
          <input
            type="month"
            value={tripSelectedMonth}
            onChange={(e) => setTripSelectedMonth(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        )}
        {tripDateFilterType === "year" && (
          <input
            type="number"
            placeholder="YYYY"
            value={tripSelectedYear}
            onChange={(e) => setTripSelectedYear(e.target.value)}
            className="border px-2 py-1 rounded w-20"
          />
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className={`p-4 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-500 to-violet-600`}>
          <div className="text-md font-semibold opacity-100">Total Trips</div>
          <div className="text-2xl font-bold mt-2">{filteredTripsCount}</div>
        </div>
        <div className={`p-4 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-500 to-violet-600`}>
          <div className="text-md font-semibold opacity-100">Total Earnings</div>
          <div className="text-xl font-bold mt-2">Rs. {totalEarning.toLocaleString()}</div>
          <div className="text-sm opacity-90 mt-1">Completed Trips Only</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {statusOptions.map((status) => (
          <button
            key={status}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              filterStatus === status
                ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-purple-400 hover:text-white"
            }`}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
        {!trips.length ? (
          <p className="p-4 text-center text-gray-500">No trips found.</p>
        ) : (
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-white border-b">
              <tr>
                <th className="p-2 text-left">Trip ID</th>
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-left">Driver</th>
                <th className="p-2 text-left">From</th>
                <th className="p-2 text-left">To</th>
                <th className="p-2 text-left">Passengers</th>
                <th className="p-2 text-left">Payment</th>
                <th className="p-2 text-left">Driver Cost</th>
                <th className="p-2 text-left">Mileage</th>
                <th className="p-2 text-left">Additional Mileage</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t) => (
                <tr key={t.trip_id} className="hover:bg-gray-50 transition">
                  <td className="p-1 cursor-pointer" onClick={()=> navigate(`/trip/${t.trip_id}`)}>{t.trip_id}</td>
                  <td className="p-1">{t.customer_id}</td>
                  <td className="p-1">{t.driver_id || "-"}</td>
                  <td className="p-1">{t.from_location}</td>
                  <td className="p-1">{t.to_location}</td>
                  <td className="p-1">{t.num_passengers}</td>
                  <td className="p-1">{t.payment_amount || "-"}</td>
                  <td className="p-1">{t.driver_cost || "0"}</td>
                  <td className="p-1">{t.mileage_cost || "0"}</td>
                  <td className="p-1">{t.additional_mileage_cost || "0"}</td>
                  <td className="p-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        t.trip_status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : t.trip_status === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : t.trip_status === "Cancelled"
                          ? "bg-red-200 text-red-800"
                          : "bg-blue-200 text-blue-800"
                      }`}
                    >
                      {t.trip_status}
                    </span>
                  </td>
                  <td className="p-1">{dayjs(t.created_at).format("YYYY-MM-DD HH:mm")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default TripsTab;
