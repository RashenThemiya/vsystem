// StatsCards.jsx
export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="Total Admins" value={stats.total} gradient="from-indigo-500 to-violet-500" />
      
    </div>
  );
}

function Card({ title, value, gradient }) {
  return (
    <div className={`p-5 rounded-xl shadow-md text-white bg-gradient-to-r ${gradient}`}>
      <div className="text-sm opacity-90">{title}</div>
      <div className="text-2xl font-bold mt-2">{value ?? 0}</div>
      <div className="text-xs mt-1 opacity-80">Overview</div>
    </div>
  );
}
