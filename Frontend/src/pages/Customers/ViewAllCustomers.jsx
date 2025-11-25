import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axiosInstance";

const ViewAllCustomers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { name, role } = useAuth();

  console.log("Logged in user:", name, "Role:", role);

  // ✅ Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/api/customers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const customerList = Array.isArray(response.data.data)
          ? response.data.data
          : []; 
        setCustomers(customerList);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError(
          err.response?.data?.message || "Failed to fetch customer data."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
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

  // ✅ Handle delete customer
  const handleDeleteCustomer = async (id) => {
    try {
      const deleted = customers.find((c) => c.customer_id === id);
      await api.delete(`/api/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCustomers(customers.filter((c) => c.customer_id !== id));
      setSuccessMessage(`✅ Customer "${deleted?.name}" deleted successfully.`);
    } catch (err) {
      console.error("Error deleting customer:", err);
      setError(
        err.response?.data?.message || "Failed to delete customer record."
      );
    }
  };

  // ✅ Handle edit customer
  const handleEditCustomer = (id) => {
    navigate(`/edit-customer/${id}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-10 relative">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-7xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          View All Customers
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
          <div className="text-center text-gray-500">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="text-center text-gray-600">No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border rounded-lg">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">NIC</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">NIC Photos</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {customers.map((customer) => (
                  <tr
                    key={customer.customer_id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-4 text-sm">{customer.customer_id}</td>
                    <td className="px-4 py-4 text-sm">{customer.name}</td>
                    <td className="px-4 py-4 text-sm">{customer.nic}</td>

                    {/* ✅ NIC Photo Display */}
                    <td className="px-4 py-4 text-sm">
                      <div className="flex flex-col md:flex-row gap-2 items-center">
                        {customer.nic_photo_front ? (
                          <img
                            src={customer.nic_photo_front}
                            alt="NIC Front"
                            className="w-20 h-14 object-cover border rounded-lg shadow-sm"
                          />
                        ) : (
                          <span className="text-gray-400">No front photo</span>
                        )}
                        {customer.nic_photo_back ? (
                          <img
                            src={customer.nic_photo_back}
                            alt="NIC Back"
                            className="w-20 h-14 object-cover border rounded-lg shadow-sm"
                          />
                        ) : (
                          <span className="text-gray-400">No back photo</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm">{customer.phone_number}</td>
                    <td className="px-4 py-4 text-sm">{customer.email}</td>

                    {/* ✅ Action Buttons */}
                    <td className="px-4 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleEditCustomer(customer.customer_id)}
                        className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Edit
                      </button>

                      <ConfirmWrapper
                        message={`Are you sure you want to delete customer "${customer.name}"?`}
                        onConfirm={() => handleDeleteCustomer(customer.customer_id)}
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
        onClick={() => navigate("/customer-management")}
        className="fixed bottom-8 right-8 bg-gray-800 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gray-900 transition duration-200"
      >
        Back to Main Menu
      </button>
    </div>
  );
};

export default ViewAllCustomers;
