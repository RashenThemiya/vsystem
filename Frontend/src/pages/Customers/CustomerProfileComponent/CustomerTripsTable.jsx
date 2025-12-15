import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const CustomerTripsTable = ({ trips }) => {
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [status, setStatus] = useState("all");
  const [totalPayment, setTotalPayment] = useState(0);
  const navigate = useNavigate();

  const statuses = ["all", ...Array.from(new Set(trips.map(t => t.trip_status)))];
  const years = ["all", ...Array.from(new Set(trips.map(t => dayjs(t.created_at).format("YYYY")))).sort((a,b)=>b-a)];
  const months = ["all", ...Array.from({ length: 12 }, (_, i) => String(i+1).padStart(2,"0"))];

  useEffect(() => {
    let filtered = [...trips];
    if(year !== "all") filtered = filtered.filter(t => dayjs(t.created_at).format("YYYY") === year);
    if(month !== "all") filtered = filtered.filter(t => dayjs(t.created_at).format("MM") === month);
    if(status !== "all") filtered = filtered.filter(t => t.trip_status === status);

    setFilteredTrips(filtered);
    setTotalPayment(filtered.reduce((sum, t) => sum + Number(t.payment_amount || 0), 0));
  }, [trips, year, month, status]);

  return (
    <div className="flex flex-col gap-4">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-500 to-violet-600">
          <div className="text-sm font-semibold">Total Trips</div>
          <div className="text-2xl font-bold mt-1">{filteredTrips.length}</div>
        </div>
        <div className="p-4 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-500 to-violet-600">
          <div className="text-sm font-semibold">Total Payment</div>
          <div className="text-xl font-bold mt-1">Rs. {totalPayment.toLocaleString()}</div>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div>
          <label className="mr-2 font-semibold">Year:</label>
          <select className="border px-2 py-1 rounded" value={year} onChange={e => setYear(e.target.value)}>
            {years.map(y => <option key={y} value={y}>{y==="all"?"All Years":y}</option>)}
          </select>
        </div>
        <div>
          <label className="mr-2 font-semibold">Month:</label>
          <select className="border px-2 py-1 rounded" value={month} onChange={e => setMonth(e.target.value)}>
            {months.map(m => <option key={m} value={m}>{m==="all"?"All Months":dayjs(`2025-${m}-01`).format("MMMM")}</option>)}
          </select>
        </div>
        
      </div>

      <div className="flex items-center gap-2">
          <label className="mr-2 font-semibold">Status:</label>
          <div className="flex gap-2">
            {statuses.map(s => (
              <button
                key={s}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                  status===s ? "bg-gradient-to-r from-indigo-500 to-violet-600   text-white shadow-md" : "bg-gray-200 text-gray-800 hover:bg-indigo-400 hover:text-white"
                }`}
                onClick={() => setStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        

      {/* Trips Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
        {filteredTrips.length===0 ? (
          <p className="p-4 text-center text-gray-500">No trips found.</p>
        ) : (
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-white border-b">
              <tr>
                <th className="p-2">Trip ID</th>
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Passengers</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Status</th>
                <th className="p-2">Distance</th>
                <th className="p-2">Days</th>
                <th className="p-2">Driver</th>
                <th className="p-2">Fuel</th>
                <th className="p-2">Costs</th>
                <th className="p-2">Created</th>
                <th className="p-2">Route</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map(t => (
                <tr key={t.trip_id} className=" text-left hover:bg-gray-50 transition text-center">
                  <td className="p-1 cursor-pointer"  onClick={()=> navigate(`/trip/${t.trip_id}`)}>{t.trip_id}</td>
                  <td className="p-1">{t.from_location}</td>
                  <td className="p-1">{t.to_location}</td>
                  <td className="p-1">{t.num_passengers}</td>
                  <td className="p-1">Rs. {t.payment_amount || "-"}</td>
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
                  <td className="p-1">
                    Est: {t.estimated_distance || "-"} km <br/>
                    Actual: {t.actual_distance || "-"} km
                  </td>
                  <td className="p-1">
                    Est: {t.estimated_days || "-"} <br/>
                    Actual: {t.actual_days || "-"}
                  </td>
                  <td className="p-1">
                    {t.driver_required} (ID {t.driver_id || "-"})
                  </td>
                  <td className="p-1">{t.fuel_required}</td>
                  <td className="p-1">
                    Est: Rs. {t.total_estimated_cost?.toLocaleString() || "-"} <br/>
                    Actual: Rs. {t.total_actual_cost?.toLocaleString() || "-"}
                  </td>
                  <td className="p-1">{dayjs(t.created_at).format("YYYY-MM-DD")}</td>
                  <td className="p-1">
                    {t.map?.length > 0 ? (
                      <ol className="list-decimal list-inside">
                        {t.map.map(m => (
                          <li key={m.map_id}>{m.location_name} ({m.latitude}, {m.longitude})</li>
                        ))}
                      </ol>
                    ) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerTripsTable;
