import Sidebar from "../../components/Sidebar";
import DashboardKPIs from "../AdminDashboard/DashboardKPIs";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar className="w-64 flex-shrink-0" />
      <div className="flex-1 overflow-auto">
        <DashboardKPIs />
      </div>
    </div>
  );
};

export default AdminDashboard;
