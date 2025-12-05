// StatsCards.jsx
export default function StatsCards({ stats, onStatusSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="Total" value={stats.total} onClick={() => onStatusSelect("")} />
      <Card title="Pending" value={stats.pending} onClick={() => onStatusSelect("Pending")} />
      <Card title="Ongoing" value={stats.ongoing} onClick={() => onStatusSelect("Ongoing")} />
      <Card title="Completed" value={stats.completed} onClick={() => onStatusSelect("Completed")} />
      <Card title="Ended" value={stats.ended} onClick={() => onStatusSelect("Ended")} />
      <Card title="Cancelled" value={stats.cancelled} onClick={() => onStatusSelect("Cancelled")} />
    </div>
  );
}

function Card({ title, value, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-5 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-500 to-violet-500 
      cursor-pointer hover:opacity-90 active:scale-95 transition"
    >
      <div className="font-semibold opacity-90">{title}</div>
      <div className="text-2xl font-bold mt-2">{value ?? 0}</div>
    </div>
  );
}

