import {
  FaCar,
  FaUser,
  FaUsers,
  FaMoneyBillWave,
  FaClipboardList,
} from "react-icons/fa";

export default function StatsCards({
  stats,
  onSelectTrips,
  onSelectVehicles,
  onSelectCustomers,
  onSelectOwners,
  onSelectPendingBills,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      
      {/* TOTAL TRIPS */}
      <Card
        title="Total Trips"
        value={stats.totalTrips}
        icon={<FaClipboardList />}
        onClick={onSelectTrips}
      />

      {/* TOTAL VEHICLES */}
      <Card
        title="Total Vehicles"
        value={stats.totalVehicles}
        icon={<FaCar />}
        onClick={onSelectVehicles}
      />

      {/* TOTAL CUSTOMERS */}
      <Card
        title="Total Customers"
        value={stats.totalCustomers}
        icon={<FaUsers />}
        onClick={onSelectCustomers}
      />

      {/* TOTAL OWNERS */}
      <Card
        title="Total Owners"
        value={stats.totalOwners}
        icon={<FaUser />}
        onClick={onSelectOwners}
      />

      {/* PENDING BILLS */}
      <Card
        title="Pending Bills"
        value={stats.pendingBillsCount}
        icon={<FaMoneyBillWave />}
        onClick={onSelectPendingBills}
      />
    </div>
  );
}

function Card({ title, value, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-5 rounded-xl shadow-md text-white
                 bg-gradient-to-r from-indigo-600 to-violet-600
                 cursor-pointer hover:opacity-90 active:scale-95
                 transition flex items-center justify-between"
    >
      <div>
        <div className="font-semibold opacity-90">{title}</div>
        <div className="text-2xl font-bold mt-1">{value ?? 0}</div>
      </div>
      <div className="text-3xl opacity-90">{icon}</div>
    </div>
  );
}
