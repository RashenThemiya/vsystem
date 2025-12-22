// StatsCards.jsx
import {
  FaListOl,
  FaClock,
  FaSpinner,
  FaCheckCircle,
  FaFlagCheckered,
  FaTimesCircle
} from "react-icons/fa";

export default function StatsCards({ stats, onStatusSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        title="Total"
        value={stats.total}
        icon={<FaListOl />}
        onClick={() => onStatusSelect("")}
      />
      
      <Card
        title="Pending"
        value={stats.pending}
        icon={<FaClock />}
        onClick={() => onStatusSelect("Pending")}
      />

      <Card
        title="Ongoing"
        value={stats.ongoing}
        icon={<FaSpinner className="animate-spin" />}
        onClick={() => onStatusSelect("Ongoing")}
      />

      <Card
        title="Ended"
        value={stats.ended}
        icon={<FaFlagCheckered />}
        onClick={() => onStatusSelect("Ended")}
      />
      
      <Card
        title="Completed"
        value={stats.completed}
        icon={<FaCheckCircle />}
        onClick={() => onStatusSelect("Completed")}
      />

      <Card
        title="Cancelled"
        value={stats.cancelled}
        icon={<FaTimesCircle />}
        onClick={() => onStatusSelect("Cancelled")}
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
      <div className="text-3xl opacity-90">
        {icon}
      </div>
    </div>
  );
}

