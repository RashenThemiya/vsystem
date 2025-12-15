export default function BillStatsCards({ stats, onClick }) {
  const cards = [
    { label: "Total Bills", value: stats.total || 0, filter: "" },
    { label: "Pending Bills", value: stats.pending || 0, filter: "pending" },
    { label: "Completed Bills", value: stats.completed || 0, filter: "completed" },
    { label: "New This Month", value: stats.newThisMonth || 0, filter: "newThisMonth" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {cards.map((card, i) => (
        <div
          key={i}
          onClick={() => onClick(card.filter)}
          className="p-5 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-600 to-violet-600 cursor-pointer hover:scale-105 transform transition"
        >
          <p className="text-md font-semibold ">{card.label}</p>
          <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
