import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axiosInstance";

const ViewAllDrivers = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { name, role } = useAuth();

  console.log("Logged in user:", name, "Role:", role);

  // ✅ Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await api.get("/api/drivers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const driverList = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setDrivers(driverList);
      } catch (err) {
        console.error("Error fetching drivers:", err);
        setError(err.response?.data?.message || "Failed to fetch driver data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  // ✅ Auto-clear messages
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // ✅ Handle delete driver
  const handleDeleteDriver = async (id) => {
    try {
      const deleted = drivers.find((d) => d.driver_id === id);
      await api.delete(`/api/drivers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDrivers(drivers.filter((d) => d.driver_id !== id));
      setSuccessMessage(`✅ Driver "${deleted?.name}" deleted successfully.`);
    } catch (err) {
      console.error("Error deleting driver:", err);
      setError(err.response?.data?.message || "Failed to delete driver record.");
    }
  };

  // ✅ Handle edit driver
  const handleEditDriver = (id) => {
    navigate(`/edit-driver/${id}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-10 relative">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-7xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6">View All Drivers</h2>

        {/* ✅ Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-center">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
            ❌ {error}
          </div>
        )}

        {/* ✅ Loading / Empty / Table */}
        {loading ? (
          <div className="text-center text-gray-500">Loading drivers...</div>
        ) : drivers.length === 0 ? (
          <div className="text-center text-gray-600">No drivers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border rounded-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">NIC</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Age</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">License No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Expiry Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Charges (Rs)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Photo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {drivers.map((driver) => (
                  <tr
                    key={driver.driver_id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-4 text-sm">{driver.driver_id}</td>
                    <td className="px-4 py-4 text-sm">{driver.name}</td>
                    <td className="px-4 py-4 text-sm">{driver.phone_number}</td>
                    <td className="px-4 py-4 text-sm">{driver.nic}</td>
                    <td className="px-4 py-4 text-sm">{driver.age}</td>
                    <td className="px-4 py-4 text-sm">{driver.license_number}</td>
                    <td className="px-4 py-4 text-sm">
                      {new Date(driver.license_expiry_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm">{driver.driver_charges}</td>

                    {/* ✅ Driver Photo */}
                    <td className="px-4 py-4 text-sm">
                      {driver.image ? (
                        <img
                          src={driver.image}
                          alt="Driver"
                          className="w-20 h-20 object-cover border rounded-lg shadow-sm"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>

                    {/* ✅ Actions */}
                    <td className="px-4 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleEditDriver(driver.driver_id)}
                        className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Edit
                      </button>

                      <ConfirmWrapper
                        message={`Are you sure you want to delete driver "${driver.name}"?`}
                        onConfirm={() => handleDeleteDriver(driver.driver_id)}
                      >
                        <button className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition duration-200">
                          Delete
                        </button>
                      </ConfirmWrapper>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ Floating Back Button */}
      <button
        onClick={() => navigate("/driver-management")}
        className="fixed bottom-8 right-8 bg-gray-800 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gray-900 transition duration-200"
      >
        Back to Main Menu
      </button>
    </div>
  );
};

export default ViewAllDrivers;
