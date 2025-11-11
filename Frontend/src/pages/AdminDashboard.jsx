import Sidebar from "../components/Sidebar";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar className="w-64 flex-shrink-0" />
    </div>
  );
};

export default AdminDashboard;
