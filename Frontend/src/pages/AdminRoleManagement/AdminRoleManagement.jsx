import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { ShieldPlus, Eye } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // adjust path if needed

const AdminRoleManagement = () => {
  const navigate = useNavigate();
  const { name, role } = useAuth();

  console.log("Logged in user:", name, "Role:", role);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-8 w-full overflow-auto">
        <div className="text-3xl font-semibold mb-8">
          <h1>Admin Role Management</h1>
          <p className="text-lg text-gray-500">
            Manage user roles and create new administrators
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">

          {/* Create New Admin */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ShieldPlus className="mr-2 text-blue-600" /> Create New Admin
            </h2>
            <p className="text-gray-700 mb-4">
              Assign administrative access to new users.
            </p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
              onClick={() => navigate("/add-admin-role")}
            >
              Create Admin
            </button>
          </div>

          {/* View All Admins */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Eye className="mr-2 text-green-600" /> View All Admins
            </h2>
            <p className="text-gray-700 mb-4">
              Browse and manage all existing admin roles.
            </p>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full sm:w-auto"
              onClick={() => navigate("/view-admin-roles")}
            >
              View Admins
            </button>
          </div>
        </div>

        {/* Optional Role Info */}
        <div className="mt-10 bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">
            Logged in as <span className="font-semibold">{name}</span> (
            <span className="capitalize">{role}</span>)
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRoleManagement;
