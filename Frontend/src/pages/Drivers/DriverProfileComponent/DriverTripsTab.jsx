import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const DriverTripsTab = ({ trips }) => {
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalEarning, setTotalEarning] = useState(0);
  const navigate = useNavigate();

  const years = ["all", ...Array.from(new Set(trips.map(t => dayjs(t.created_at).format("YYYY")))).sort((a,b)=>b-a)];
  const months = ["all", ...Array.from({ length: 12 }, (_, i) => String(i+1).padStart(2, "0"))];
  const statuses = ["all", "Pending", "Ongoing", "Completed", "Cancelled", "Ended"];

  useEffect(() => {
    let filtered = [...trips];
    if(year !== "all") filtered = filtered.filter(t => dayjs(t.created_at).format("YYYY") === year);
    if(month !== "all") filtered = filtered.filter(t => dayjs(t.created_at).format("MM") === month);
    if(statusFilter !== "all") filtered = filtered.filter(t => t.trip_status === statusFilter);

    setFilteredTrips(filtered);
    const total = filtered.reduce((sum, t) => {
      if(t.trip_status==="Completed") {
        return sum + Number(t.driver_cost || t.payment_amount || t.total_actual_cost || 0);
      }
      return sum;
    }, 0);
    setTotalEarning(total);
  }, [trips, year, month, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div>
          <label className="mr-2 font-semibold">Year:</label>
          <select className="border p-2 rounded" value={year} onChange={e => setYear(e.target.value)}>
            {years.map(y => <option key={y} value={y}>{y==="all"?"All Years":y}</option>)}
          </select>
        </div>
        <div>
          <label className="mr-2 font-semibold">Month:</label>
          <select className="border p-2 rounded" value={month} onChange={e => setMonth(e.target.value)}>
            {months.map(m => <option key={m} value={m}>{m==="all"?"All Months":dayjs(`2025-${m}-01`).format("MMMM")}</option>)}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-500 to-violet-600">
          <div className="text-sm font-semibold">Total Trips</div>
          <div className="text-2xl font-bold mt-1">{filteredTrips.length}</div>
        </div>
        <div className="p-4 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-500 to-violet-600">
          <div className="text-sm font-semibold">Total Earnings</div>
          <div className="text-xl font-bold mt-1">Rs. {totalEarning.toLocaleString()}</div>
          <div className="text-sm opacity-90 mt-1">Completed Trips Only</div>
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        <strong>Status: </strong>
        {statuses.map(s => (
          <button
            key={s}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              statusFilter === s
                ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-purple-400 hover:text-white"
            }`}
            onClick={() => setStatusFilter(s)}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      {/* Trips Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
        {filteredTrips.length===0 ? (
          <p className="p-4 text-center text-gray-500">No trips found.</p>
        ) : (
          <table className="w-full table-auto border-collapse text-sm text-center">
            <thead className="bg-white border-b">
              <tr>
                <th className="p-2">Trip ID</th>
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Passengers</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Driver Cost</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map(t => (
                <tr key={t.trip_id} className="text-left hover:bg-gray-50 transition">
                  <td className="p-1 cursor-pointer" onClick={()=> navigate(`/trip/${t.trip_id}`)}>{t.trip_id}</td>
                  <td className="p-1">{t.from_location}</td>
                  <td className="p-1">{t.to_location}</td>
                  <td className="p-1">{t.num_passengers}</td>
                  <td className="p-1">{t.payment_amount || "-"}</td>
                  <td className="p-1">{t.driver_cost || "0"}</td>
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
                  <td className="p-1">{dayjs(t.created_at).format("YYYY-MM-DD")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DriverTripsTab;
