import {
  FaCar,
  FaUser,
  FaUsers,
  FaMoneyBillWave,
  FaClipboardList,
  FaListOl,
  FaClock,
  FaSpinner,
  FaCheckCircle,
  FaFlagCheckered,
  FaTimesCircle
} from "react-icons/fa";

export default function StatsCards({ stats, onStatusSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <Card
        title="Total Trips"
        value={stats.totalTrips}
        icon={<FaClipboardList />}
        onClick={() => onStatusSelect("")}
      />

      <Card
        title="Total Vehicles"
        value={stats.totalVehicles}
        icon={<FaCar />}
        onClick={() => onStatusSelect("")}
      />

      <Card
        title="Total Customers"
        value={stats.totalCustomers}
        icon={<FaUsers />}
        onClick={() => onStatusSelect("")}
      />

      <Card
        title="Total Owners"
        value={stats.totalOwners}
        icon={<FaUser />}
        onClick={() => onStatusSelect("")}
      />

      <Card
        title="Pending Bills"
        value={stats.pendingBillsCount}
        icon={<FaMoneyBillWave />}
        onClick={() => onStatusSelect("Pending")}
      />
    </div>
  );
}

function Card({ title, value, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-5 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-600 to-violet-600
                 cursor-pointer hover:opacity-90 active:scale-95 transition flex items-center justify-between"
    >
      {/* Left Text Section */}
      <div>
        <div className="font-semibold opacity-90">{title}</div>
        <div className="text-2xl font-bold mt-1">{value ?? 0}</div>
      </div>

      {/* Right Icon */}
      <div className="text-3xl opacity-90">{icon}</div>
    </div>
  );
}
