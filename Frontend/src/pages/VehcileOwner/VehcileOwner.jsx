import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { PlusCircle, Users, FileText } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // adjust path if needed

const VehicleOwner = () => {
  const navigate = useNavigate();
  const { name, role } = useAuth();

  console.log("Logged in user:", name, "Role:", role);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-8 w-full overflow-auto bg-gray-50">
        <div className="text-3xl font-semibold mb-8">
          <h1>Vehicle Owner Management</h1>
          <p className="text-lg text-gray-500">
            Manage vehicle owners and related records
          </p>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {/* Add New Owner */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <PlusCircle className="mr-2 text-blue-600" />
              Add New Owner
            </h2>
            <p className="text-gray-700 mb-4">
              Register a new vehicle owner in the system.
            </p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
              onClick={() => navigate("/add-owner")}
            >
              Add Owner
            </button>
          </div>

          {/* View All Owners */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="mr-2 text-green-600" />
              View All Owners
            </h2>
            <p className="text-gray-700 mb-4">
              View and manage all registered vehicle owners.
            </p>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full sm:w-auto"
              onClick={() => navigate("/view-owners")}
            >
              View Owners
            </button>
          </div>

          {/* Owner Reports */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2 text-purple-600" />
              Owner Reports
            </h2>
            <p className="text-gray-700 mb-4">
              Generate and view detailed owner activity reports.
            </p>
            <button
              className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 w-full sm:w-auto"
              onClick={() => navigate("/owner-reports")}
            >
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleOwner;
