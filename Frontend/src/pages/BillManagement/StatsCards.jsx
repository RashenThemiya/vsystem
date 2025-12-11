export default function BillStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
      {[
        { label: "Total Bills", value: stats.total || 0 },
        { label: "Pending Bills", value: stats.pending || 0 },
        { label: "Completed Bills", value: stats.completed || 0 },
        { label: "New This Month", value: stats.newThisMonth || 0 },
      ].map((card, i) => (
        <div
          key={i}
          className="p-5 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-600 to-violet-600"
        >
          <p className="text-md font-semibold ">{card.label}</p>
          <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
