import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axiosInstance";

const ViewVehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { name, role } = useAuth();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get("/api/vehicles");
        const vehicleList = Array.isArray(response.data) ? response.data : [];
        setVehicles(vehicleList);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError(err.response?.data?.message || "Failed to fetch vehicle data.");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const handleDeleteVehicle = async (id) => {
    try {
      const deleted = vehicles.find((v) => v.vehicle_id === id);
      await api.delete(`/api/vehicles/${id}`);
      setVehicles(vehicles.filter((v) => v.vehicle_id !== id));
      setSuccessMessage(`✅ Vehicle "${deleted?.vehicle_number}" deleted successfully.`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete vehicle.");
    }
  };

  const handleEditVehicle = (id) => {
    navigate(`/vehicles/edit/${id}`); // route to your edit page
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-10 relative">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-7xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6">View Vehicles</h2>

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

        {loading ? (
          <div className="text-center text-gray-500">Loading vehicles...</div>
        ) : vehicles.length === 0 ? (
          <div className="text-center text-gray-600">No vehicles found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border rounded-lg">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Number</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">AC</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Fuel</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Rent (Rs)</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Availability</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Owner</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Contact</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Mileage Costs</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {vehicles.map((v) => (
                  <tr key={v.vehicle_id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-3 text-sm">{v.vehicle_id}</td>
                    <td className="px-6 py-3 text-sm">{v.vehicle_number}</td>
                    <td className="px-6 py-3 text-sm">{v.name}</td>
                    <td className="px-6 py-3 text-sm">{v.type}</td>
                    <td className="px-6 py-3 text-sm">{v.ac_type}</td>
                    <td className="px-6 py-3 text-sm">{v.fuel?.type}</td>
                    <td className="px-6 py-3 text-sm">{v.rent_cost_daily}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-white text-xs ${v.vehicle_availability === "Yes" ? "bg-green-500" : "bg-red-500"}`}>
                        {v.vehicle_availability}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">{v.owner?.owner_name}</td>
                    <td className="px-6 py-3 text-sm">{v.owner?.contact_number}</td>
                    <td className="px-6 py-3 text-sm">
                      {v.mileage_costs.length > 0 ? (
                        <ul className="list-disc ml-4">
                          {v.mileage_costs.map((m) => (
                            <li key={m.mileage_cost_id}>
                              Base: {m.mileage_cost}, Additional: {m.mileage_cost_additional}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400">No data</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm space-x-2">
                      <button
                        onClick={() => handleEditVehicle(v.vehicle_id)}
                        className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Edit
                      </button>
                      <ConfirmWrapper
                        message={`Are you sure you want to delete vehicle "${v.vehicle_number}"?`}
                        onConfirm={() => handleDeleteVehicle(v.vehicle_id)}
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

      <button
        onClick={() => navigate("/vehicle-management")}
        className="fixed bottom-8 right-8 bg-gray-800 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gray-900 transition duration-200"
      >
        Back to Main Menu
      </button>
    </div>
  );
};

export default ViewVehicles;
