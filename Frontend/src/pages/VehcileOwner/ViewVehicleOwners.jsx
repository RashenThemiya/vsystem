import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axiosInstance";

const ViewVehicleOwners = () => {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { name, role } = useAuth();

  console.log("Logged in user:", name, "Role:", role);

  // ✅ Fetch owners
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await api.get("/api/owners");
        // ✅ API returns { success: true, data: [...] }
        const ownerList = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setOwners(ownerList);
      } catch (err) {
        console.error("Error fetching owners:", err);
        setError(
          err.response?.data?.message || "Failed to fetch vehicle owners."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOwners();
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

  // ✅ Handle delete owner
  const handleDeleteOwner = async (id) => {
    try {
      const deleted = owners.find((o) => o.owner_id === id);
      await api.delete(`/api/owners/${id}`);
      setOwners(owners.filter((o) => o.owner_id !== id));
      setSuccessMessage(`✅ Owner "${deleted?.owner_name}" deleted successfully.`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete vehicle owner."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-10 relative">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-5xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          View Vehicle Owners
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
          <div className="text-center text-gray-500">Loading owners...</div>
        ) : owners.length === 0 ? (
          <div className="text-center text-gray-600">
            No vehicle owners found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border rounded-lg">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Owner ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Owner Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Contact Number
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {owners.map((owner) => (
                  <tr
                    key={owner.owner_id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm">{owner.owner_id}</td>
                    <td className="px-6 py-4 text-sm">{owner.owner_name}</td>
                    <td className="px-6 py-4 text-sm">{owner.contact_number}</td>
                    <td className="px-6 py-4 text-sm">
                      <ConfirmWrapper
                        message={`Are you sure you want to delete owner "${owner.owner_name}"? This action cannot be undone.`}
                        onConfirm={() => handleDeleteOwner(owner.owner_id)}
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
        onClick={() => navigate("/vehicle-owner")}
        className="fixed bottom-8 right-8 bg-gray-800 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gray-900 transition duration-200"
      >
        Back to Main Menu
      </button>
    </div>
  );
};

export default ViewVehicleOwners;
