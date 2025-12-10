// StatsCards.jsx
export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="Total Vehicles" value={stats.total} />
      
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className={`p-5 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-600 to-violet-600`}>
      <div className="text-sm opacity-90">{title}</div>
      <div className="text-2xl font-bold mt-2">{value ?? 0}</div>
      
    </div>
  );
}
