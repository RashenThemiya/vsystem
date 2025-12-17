import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { FaChevronDown, FaChevronUp, FaPrint } from "react-icons/fa";

const TripsTable = ({ trips }) => {
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [expandedTripId, setExpandedTripId] = useState(null);
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [status, setStatus] = useState("all");
  const [totalPayment, setTotalPayment] = useState(0);

  const statuses = ["all", ...Array.from(new Set(trips.map(t => t.trip_status)))];
  const years = ["all", ...Array.from(new Set(trips.map(t =>
    dayjs(t.created_at).format("YYYY")
  ))).sort((a, b) => b - a)];
  const months = ["all", ...Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  )];

  useEffect(() => {
    let filtered = [...trips];
    if (year !== "all")
      filtered = filtered.filter(t => dayjs(t.created_at).format("YYYY") === year);
    if (month !== "all")
      filtered = filtered.filter(t => dayjs(t.created_at).format("MM") === month);
    if (status !== "all")
      filtered = filtered.filter(t => t.trip_status === status);

    setFilteredTrips(filtered);
    setTotalPayment(
      filtered.reduce((sum, t) => sum + Number(t.payment_amount || 0), 0)
    );
  }, [trips, year, month, status]);

  const toggleExpand = (id) => {
    setExpandedTripId(prev => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-500 to-violet-600">
          <div className="text-sm font-semibold">Total Trips</div>
          <div className="text-2xl font-bold mt-1">{filteredTrips.length}</div>
        </div>
        <div className="p-4 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-500 to-violet-600">
          <div className="text-sm font-semibold">Total Payment</div>
          <div className="text-xl font-bold mt-1">
            Rs. {totalPayment.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Trips Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
        {filteredTrips.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No trips found.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="border-b">
              <tr>
                <th className="p-2">Trip ID</th>
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Payment Status</th>
                <th className="p-2">Trip Status</th>
                <th className="p-2 text-center">View</th>
              </tr>
            </thead>

            <tbody>
              {filteredTrips.map(t => (
                <>
                  {/* Main Row */}
                  <tr
                    key={t.trip_id}
                    className="hover:bg-gray-50 transition text-center"
                  >
                    <td className="p-2 font-semibold">{t.trip_id}</td>
                    <td className="p-2">{t.from_location}</td>
                    <td className="p-2">{t.to_location}</td>
                    <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${t.payment_status === "Paid"
                          ? "bg-green-200 text-green-800"
                          : t.payment_status === "Partially_Paid"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"}`}>
                        {t.payment_status}
                      </span>
                      </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${t.trip_status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : t.trip_status === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-blue-200 text-blue-800"}`}>
                        {t.trip_status}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => toggleExpand(t.trip_id)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {expandedTripId === t.trip_id
                          ? <FaChevronUp />
                          : <FaChevronDown />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expandedTripId === t.trip_id && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="p-4">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">

                          {/* Route Details */}
                          <div>
                            <h4 className="font-semibold mb-2 text-indigo-600">
                              Route Details
                            </h4>
                            {t.map?.length > 0 ? (
                              <ul className="list-disc list-inside">
                                {t.map.map(m => (
                                  <li key={m.map_id}>
                                    {m.location_name} ({m.latitude}, {m.longitude})
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>No route data</p>
                            )}
                          </div>

                          {/* Payment Details */}
                            <div>
                            <h4 className="font-semibold mb-2 text-indigo-600">
                                Payment Details
                            </h4>

                            {t.payments?.length > 0 ? (
                                <>
                                <table className="w-60 text-sm  rounded">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-left">Date</th>
                                        <th className="p-2 text-right">Amount (Rs.)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {t.payments.map(p => (
                                        <tr key={p.payment_id} className="">
                                        <td className="p-2">
                                            {dayjs(p.payment_date).format("YYYY-MM-DD")}
                                        </td>
                                        <td className="p-2 text-right">
                                            {Number(p.amount).toLocaleString()}
                                        </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                                {/* Total Paid */}
                                <div className="mt-2 font-semibold text-left">
                                    Total Paid: Rs.{" "}
                                    {t.payments
                                    .reduce((sum, p) => sum + Number(p.amount || 0), 0)
                                    .toLocaleString()}
                                </div>
                                </>
                            ) : (
                                <p className="text-gray-500">No payments recorded</p>
                            )}

                            <button
                                onClick={() => window.print()}
                                className="mt-3 inline-flex items-center gap-2
                                px-3 py-1 rounded bg-indigo-600 text-white
                                hover:bg-indigo-700"
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
