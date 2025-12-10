import dayjs from "dayjs";

const CostsTab = ({
  costs,
  costDateFilterType,
  setCostDateFilterType,
  costSelectedMonth,
  setCostSelectedMonth,
  costSelectedYear,
  setCostSelectedYear,
}) => {

  // 👉 Calculate total other costs
  const totalOtherCosts = costs.reduce(
    (sum, c) => sum + Number(c.cost || 0),
    0
  );

  return (
    <>
      {/* FILTERS */}
      <div className="flex gap-2 items-center mb-4">
        <label className="text-sm font-semibold">Filter Costs by:</label>
        <select
          value={costDateFilterType}
          onChange={(e) => {
            setCostDateFilterType(e.target.value);
            setCostSelectedMonth("");
            setCostSelectedYear("");
          }}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>

        {costDateFilterType === "month" && (
          <input
            type="month"
            value={costSelectedMonth}
            onChange={(e) => setCostSelectedMonth(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        )}

        {costDateFilterType === "year" && (
          <input
            type="number"
            placeholder="YYYY"
            value={costSelectedYear}
            onChange={(e) => setCostSelectedYear(e.target.value)}
            className="border px-2 py-1 rounded w-20"
          />
        )}
      </div>

      {/* TOTAL COST CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-500 to-violet-600">
          <div className="text-sm font-semibold opacity-100">Total Costs</div>

          {/* 👉 Show Calculated Total */}
          <div className="text-xl font-bold mt-2">
            Rs. {totalOtherCosts.toLocaleString()}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        {!costs.length ? (
          <p className="p-4 text-center text-gray-500">No other costs found.</p>
        ) : (
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Cost ID</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Cost Type</th>
                <th className="p-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((c) => (
                <tr
                  key={c.vehicle_other_cost_id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-1">{c.vehicle_other_cost_id}</td>
                  <td className="p-1">{c.date?.split("T")[0]}</td>
                  <td className="p-1">{c.cost_type}</td>
                  <td className="p-1">Rs. {Number(c.cost).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default CostsTab;
