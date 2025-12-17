import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { FaChevronDown, FaChevronUp, FaPrint } from "react-icons/fa";

const TripsTable = ({ trips, onOpenPrintModal  }) => {
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [expandedTripId, setExpandedTripId] = useState(null);
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [status, setStatus] = useState("all");
  const [paymentstatus, setpaymentStatus] = useState("all");
  const [totalPayment, setTotalPayment] = useState(0);

  const statuses = ["all", ...Array.from(new Set(trips.map(t => t.trip_status)))];
  const paymentstatuses = ["all", ...Array.from(new Set(trips.map(t => t.payment_status)))];
  const years = ["all", ...Array.from(new Set(trips.map(t =>
    dayjs(t.created_at).format("YYYY")
  ))).sort((a, b) => b - a)];
  const months = ["all", ...Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  )];

  const topRightImage="../../images/footer.png"

  useEffect(() => {
    let filtered = [...trips];
    if (year !== "all")
      filtered = filtered.filter(t => dayjs(t.created_at).format("YYYY") === year);
    if (month !== "all")
      filtered = filtered.filter(t => dayjs(t.created_at).format("MM") === month);
    if (status !== "all")
      filtered = filtered.filter(t => t.trip_status === status);
    if (paymentstatus !== "all")
      filtered = filtered.filter(t => t.payment_status === paymentstatus);

    setFilteredTrips(filtered);
    setTotalPayment(
      filtered.reduce((sum, t) => sum + Number(t.payment_amount || 0), 0)
    );
  }, [trips, year, month, status, paymentstatus]);

  const toggleExpand = (id) => setExpandedTripId(prev => (prev === id ? null : id));

  return (
    <div className="flex flex-col gap-4">

      {/* Top Stats + Image */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <div className="p-4 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-500 to-violet-600 min-w-[150px]">
            <div className="text-sm font-semibold">Total Trips</div>
            <div className="text-2xl font-bold mt-1">{filteredTrips.length}</div>
          </div>
          <div className="p-4 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-500 to-violet-600 min-w-[150px]">
            <div className="text-sm font-semibold">Total Payment</div>
            <div className="text-xl font-bold mt-1">
              Rs. {totalPayment.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Top-right image */}
        {topRightImage && (
          <div className="w-30 h-30 md:w-32 md:h-32">
            <img
              src={topRightImage}
              alt="Top Right"
              className="w-full h-full object-cover rounded-full shadow-md"
            />
          </div>
        )}
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

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label className="mr-2 font-semibold">Status:</label>
          <div className="flex gap-2 flex-wrap">
            {statuses.map(s => (
              <button
                key={s}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                  status===s ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md" : "bg-gray-200 text-gray-800 hover:bg-indigo-400 hover:text-white"
                }`}
                onClick={() => setStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="mr-2 font-semibold">Payment Status:</label>
          <div className="flex gap-2 flex-wrap">
            {paymentstatuses.map(s => (
              <button
                key={s}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                  paymentstatus===s ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md" : "bg-gray-200 text-gray-800 hover:bg-indigo-400 hover:text-white"
                }`}
                onClick={() => setpaymentStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trips Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
        {filteredTrips.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No trips found.</p>
        ) : (
          <table className="w-full text-sm border-collapse min-w-[700px]">
            <thead className="border-b">
              <tr>
                <th className="p-2">Trip ID</th>
                <th className="p-2">Created Date</th>
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Leave Date</th>
                <th className="p-2">Return Date</th>
                <th className="p-2">Payment Status</th>
                <th className="p-2">Trip Status</th>
                <th className="p-2 text-center">View</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map(t => (
                <>
                  <tr key={t.trip_id} className="hover:bg-gray-50 transition text-center">
                    <td className="p-2 font-semibold">{t.trip_id}</td>
                    <td className="p-2">{dayjs(t.created_at).format("YYYY-MM-DD")}</td>
                    <td className="p-2">{t.from_location}</td>
                    <td className="p-2">{t.to_location}</td>
                    <td className="p-2">{dayjs(t.leaving_datetime).format("YYYY-MM-DD")}</td>
                    <td className="p-2">
                      Est: {t.estimated_return_datetime ? dayjs(t.estimated_return_datetime).format("YYYY-MM-DD") : "-"} <br/>
                      Actual: {t.actual_return_datetime ? dayjs(t.actual_return_datetime).format("YYYY-MM-DD") : "-"}
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${t.payment_status === "Paid" ? "bg-green-200 text-green-800" :
                          t.payment_status === "Partially_Paid" ? "bg-yellow-200 text-yellow-800" :
                          "bg-red-200 text-red-800"}`}>
                        {t.payment_status}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${t.trip_status === "Completed" ? "bg-green-200 text-green-800" :
                          t.trip_status === "Pending" ? "bg-yellow-200 text-yellow-800" :
                          "bg-blue-200 text-blue-800"}`}>
                        {t.trip_status}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <button onClick={() => toggleExpand(t.trip_id)} className="text-indigo-600 hover:text-indigo-800">
                        {expandedTripId === t.trip_id ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </td>
                  </tr>

                  {expandedTripId === t.trip_id && (
                    <tr className="bg-gray-50">
                      <td colSpan={9} className="p-4">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          {/* Route Details */}
                          <div>
                            <h4 className="font-semibold mb-2 text-indigo-600">Route Details</h4>
                            {t.map?.length > 0 ? (
                              <ul className="list-disc list-inside">
                                {t.map.map(m => (
                                  <li key={m.map_id}>{m.location_name} ({m.latitude}, {m.longitude})</li>
                                ))}
                              </ul>
                            ) : <p>No route data</p>}
                          </div>

                          {/* Payment Details */}
                          <div>
                            <h4 className="font-semibold mb-2 text-indigo-600">Payment Details</h4>
                            {t.payments?.length > 0 ? (
                              <>
                                <table className="w-60 text-sm rounded">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="p-2 text-left">Date</th>
                                      <th className="p-2 text-right">Amount (Rs.)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {t.payments.map(p => (
                                      <tr key={p.payment_id}>
                                        <td className="p-2">{dayjs(p.payment_date).format("YYYY-MM-DD")}</td>
                                        <td className="p-2 text-right">{Number(p.amount).toLocaleString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                <div className="mt-2 font-semibold text-left">
                                  Total Paid: Rs. {t.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0).toLocaleString()}
                                </div>
                              </>
                            ) : <p className="text-gray-500">No payments recorded</p>}
                            <button
                                onClick={() => onOpenPrintModal(t.trip_id)} // pass trip ID to modal
                                className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                                <FaPrint /> Download Invoice
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TripsTable;
