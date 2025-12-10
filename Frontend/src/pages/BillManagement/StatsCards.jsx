export default function BillStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {[
        { label: "Total Bills", value: stats.total || 0 },
        { label: "Pending Bills", value: stats.pending || 0 },
        { label: "Completed Bills", value: stats.completed || 0 },
        { label: "New This Month", value: stats.newThisMonth || 0 },
      ].map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-green-600">{card.value}</h2>
          <p className="text-sm mt-2 text-gray-700">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
