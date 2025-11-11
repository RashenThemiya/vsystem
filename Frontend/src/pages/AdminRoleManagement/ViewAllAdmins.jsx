import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axiosInstance";

const ViewAllAdmins = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { name, role } = useAuth();

  console.log("Logged in user:", name, "Role:", role);

  // ✅ Fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await api.get("/api/admin-roles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const adminList = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setAdmins(adminList);
      } catch (err) {
        console.error("Error fetching admins:", err);
        setError(
          err.response?.data?.message || "Failed to fetch admin data."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  // ✅ Auto-clear success/error messages
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // ✅ Handle delete admin
  const handleDeleteAdmin = async (id) => {
    try {
      const deleted = admins.find((a) => a.admin_id === id);
      await api.delete(`/api/admin-roles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAdmins(admins.filter((a) => a.admin_id !== id));
      setSuccessMessage(`✅ Admin "${deleted?.email}" deleted successfully.`);
    } catch (err) {
      console.error("Error deleting admin:", err);
      setError(
        err.response?.data?.message || "Failed to delete admin record."
      );
    }
  };

  // ✅ Handle edit admin
  const handleEditAdmin = (id) => {
    navigate(`/edit-admin/${id}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-10 relative">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-7xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          View All Admins
        </h2>

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
          <div className="text-center text-gray-500">Loading admins...</div>
        ) : admins.length === 0 ? (
          <div className="text-center text-gray-600">No admins found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border rounded-lg">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {admins.map((admin) => (
                  <tr
                    key={admin.admin_id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-4 text-sm">{admin.admin_id}</td>
                    <td className="px-4 py-4 text-sm">{admin.email}</td>
                    <td className="px-4 py-4 text-sm">{admin.role}</td>

                    {/* ✅ Action Buttons */}
                    <td className="px-4 py-4 text-sm flex gap-2">
                     

                      <ConfirmWrapper
                        message={`Are you sure you want to delete admin "${admin.email}"?`}
                        onConfirm={() => handleDeleteAdmin(admin.admin_id)}
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
        onClick={() => navigate("/admin-role-management")}
        className="fixed bottom-8 right-8 bg-gray-800 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gray-900 transition duration-200"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ViewAllAdmins;
