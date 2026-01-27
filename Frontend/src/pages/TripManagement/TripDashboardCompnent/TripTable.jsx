export default function TripTable({
  trips = [],
  loading,
  error,
  onSelectTrip,
  onSelectDriver,
  onSelectVehicle,
  onSelectCustomer,
  onStartTrip,
  onEndTrip,
  onCreateAnotherTrip,
}) {

  const statusStyles = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Ongoing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Ended":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading Trips...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : trips.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No trips found.</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-white sticky top-0 z-10 text-left text-sm text-gray-600 border-b">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">From</th>
                  <th className="px-4 py-3">To</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Leaving</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {trips.map((t) => (
                  <tr
                    key={t.trip_id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td
                      className="px-4 py-4 text-blue-600 hover:underline"
                      onClick={() => onSelectTrip(t)}
                    >
                      {t.trip_id}
                    </td>
                    <td className="px-4 py-4">{t.from_location}</td>
                    <td className="px-4 py-4">{t.to_location}</td>
                    <td
                      className="px-4 py-4 text-blue-600 hover:underline cursor-pointer"
                      onClick={() => onSelectCustomer(t)}
                    >
                      {t.customer?.name}
                    </td>
                    <td
                      className="px-4 py-4 text-blue-600 hover:underline cursor-pointer"
                      onClick={() => onSelectVehicle(t)}
                    >
                      {t.vehicle?.name}
                    </td>
                    <td
                      className="px-4 py-4 text-blue-600 hover:underline cursor-pointer"
                      onClick={() => onSelectDriver(t)}
                    >
                      {t.driver?.name || "N/A"}
                    </td>

                    {/* ✨ STATUS BADGE */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles(
                          t.trip_status
                        )}`}
                      >
                        {t.trip_status}
                      </span>
                    </td>

                    <td className="px-4 py-4">{t.payment_status}</td>
                    <td className="px-4 py-4">
                      {new Date(t.leaving_datetime).toLocaleString()}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        {t.trip_status === "Pending" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartTrip(t.trip_id);
                            }}
                            className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-3 py-1 rounded"
                          >
                            Start
                          </button>
                        )}

                        {t.trip_status === "Ongoing" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEndTrip(t.trip_id, t.vehicle?.meter_number);
                            }}
                            className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-3 py-1 rounded"
                          >
                            End
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCreateAnotherTrip(t);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                        >
                          Rebook
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
}
