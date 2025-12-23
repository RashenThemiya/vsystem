import { useState } from "react";
import { PlusCircle } from "react-feather";
import AddVehicleCostModal from "./AddVehicleCostModal";

const CostsTab = ({
  vehicleId,
  costs,
  costDateFilterType,
  setCostDateFilterType,
  costSelectedMonth,
  setCostSelectedMonth,
  costSelectedYear,
  setCostSelectedYear,
  refreshVehicle, // 👈 passed from parent
}) => {
  const [isAddCostModalOpen, setIsAddCostModalOpen] = useState(false);
  const [selectedCostType, setSelectedCostType] = useState("all");

const costTypeOptions = [
  "all",
  ...Array.from(new Set(costs.map(c => c.cost_type).filter(Boolean))),
];

const filteredCosts =
  selectedCostType === "all"
    ? costs
    : costs.filter(c => c.cost_type === selectedCostType);


  const totalFilteredCosts = filteredCosts.reduce(
  (sum, c) => sum + Number(c.cost || 0),
  0
);

const costTitle =
  selectedCostType === "all"
    ? "Total Costs"
    : `${selectedCostType} Total`;


  return (
    <>
      {/* FILTERS */}
      

      {/* STATS + ADD COST */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-1 mt-6 items-stretch">
        {/* Total Cost Card */}
        <div className="lg:col-span-3 h-full">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="p-5 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-600 to-violet-600">
      <div className="text-md font-semibold opacity-90">
        {costTitle}
      </div>
      <div className="text-2xl font-bold mt-2">
        Rs. {totalFilteredCosts.toLocaleString()}
      </div>
    </div>
  </div>
</div>


        {/* Add Cost Card */}
        <div className="lg:col-span-1 h-full flex flex-col">
          <div className="flex flex-col gap-4 h-full">
        <div className="bg-white p-5 rounded-xl shadow flex flex-col justify-between h-full "
          onClick={() => setIsAddCostModalOpen(true)}
        >
          
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-50">
              <PlusCircle className="text-blue-600" size={24} />
            </div>
            <div className="font-semibold text-gray-700">
              Add New Other Cost
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Add a new cost entry for this vehicle.
          </p>
        </div>
        </div>
        </div>
      </div>

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
      <div className="flex flex-wrap gap-2 mb-3">
        {costTypeOptions.map((type) => (
          <button
            key={type}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              selectedCostType === type
                ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-purple-400 hover:text-white"
            }`}
            onClick={() => setSelectedCostType(type)}
          >
            {type}
          </button>
        ))}
      </div>



      {/* MODAL */}
      <AddVehicleCostModal
        vehicleId={vehicleId}
        isOpen={isAddCostModalOpen}
        onClose={() => setIsAddCostModalOpen(false)}
        onSuccess={() => {
          setIsAddCostModalOpen(false);
          refreshVehicle(); // 🔥 refresh data properly
        }}
      />

      {/* TABLE */}
      <div className="bg-white shadow-md rounded-xl p-3">
  {filteredCosts.length === 0 ? (
    <p className="p-4 text-center text-gray-500">No other costs found.</p>
  ) : (
    <div className="pl-2 pr-2 max-h-[500px] overflow-y-auto">
      <table className="w-full table-auto border-collapse text-sm">
        <thead className="bg-white border-b sticky top-0 z-20 border-gray-500">
          <tr>
            <th className="p-2 text-left">Cost ID</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Cost Type</th>
            <th className="p-2 text-left">Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredCosts.map((c) => (
            <tr key={c.vehicle_other_cost_id} className="hover:bg-gray-50">
              <td className="p-2">{c.vehicle_other_cost_id}</td>
              <td className="p-2">{c.date?.split("T")[0]}</td>
              <td className="p-2">{c.cost_type}</td>
              <td className="p-2">Rs. {Number(c.cost).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

    </>
  );
};

export default CostsTab;
